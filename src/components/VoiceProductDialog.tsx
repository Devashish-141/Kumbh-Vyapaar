import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, Sparkles, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface VoiceProductDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onProductAdded: () => void;
}

export const VoiceProductDialog = ({ isOpen, onClose, onProductAdded }: VoiceProductDialogProps) => {
    const { selectedLanguage } = useLanguage();
    const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [stage, setStage] = useState<"listening" | "processing" | "confirm" | "success">("listening");
    const [currentField, setCurrentField] = useState<string | null>(null);
    const [filledFields, setFilledFields] = useState<string[]>([]);

    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                setTranscript(finalTranscript || interimTranscript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setError(`Voice recognition error: ${event.error}`);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                if (isListening) {
                    recognitionRef.current?.start();
                }
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            window.speechSynthesis.cancel();
        };
    }, [selectedLanguage, isListening]);

    const speak = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.9;
        synthRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            if (transcript.trim()) {
                processTranscript();
            }
        } else {
            setTranscript("");
            setError("");
            recognitionRef.current?.start();
            setIsListening(true);
            speak(t.voicePrompt || "Please tell me about your product. Include the name, price, description, and stock quantity.");
        }
    };

    const processTranscript = async () => {
        setStage("processing");
        setIsProcessing(true);
        setFilledFields([]);

        // Simple keyword extraction (in production, you'd use a proper NLP service)
        const text = transcript.toLowerCase();

        // Extract product details using basic pattern matching
        const extractedInfo: any = {
            serialNumber: "",
            name: "",
            price: 0,
            stock: 0,
            category: "",
            description: transcript,
        };

        // Helper function to announce and highlight field
        const announceField = (fieldName: string, value: any, delay: number) => {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    setCurrentField(fieldName);
                    const announcement = getFieldAnnouncement(fieldName, value);
                    speak(announcement);

                    setTimeout(() => {
                        setFilledFields(prev => [...prev, fieldName]);
                        setCurrentField(null);
                        resolve();
                    }, 1500);
                }, delay);
            });
        };

        const getFieldAnnouncement = (field: string, value: any): string => {
            const announcements: Record<string, string> = {
                serialNumber: selectedLanguage === 'hi'
                    ? `सीरियल नंबर भर रहा हूं: ${value}`
                    : `Filling serial number: ${value}`,
                name: selectedLanguage === 'hi'
                    ? `उत्पाद का नाम भर रहा हूं: ${value}`
                    : `Filling product name: ${value}`,
                price: selectedLanguage === 'hi'
                    ? `कीमत भर रहा हूं: ${value} रुपये`
                    : `Filling price: ${value} rupees`,
                stock: selectedLanguage === 'hi'
                    ? `स्टॉक भर रहा हूं: ${value} यूनिट`
                    : `Filling stock: ${value} units`,
                category: selectedLanguage === 'hi'
                    ? `श्रेणी भर रहा हूं: ${value}`
                    : `Filling category: ${value}`,
                description: selectedLanguage === 'hi'
                    ? `विवरण भर रहा हूं`
                    : `Filling description`,
            };
            return announcements[field] || `Filling ${field}: ${value}`;
        };

        // Extract serial number (looking for SKU, serial, or code patterns)
        const serialMatch = text.match(/(?:sku|serial|code)[\s:-]*([a-z0-9-]+)/i);
        if (serialMatch) {
            extractedInfo.serialNumber = serialMatch[1].toUpperCase();
        }

        // Extract name (first few words or sentence)
        const sentences = transcript.split(/[.!?]/);
        if (sentences.length > 0) {
            extractedInfo.name = sentences[0].trim().slice(0, 50);
        }

        // Try to extract price (looking for numbers with rupee symbols or "rupees")
        const priceMatch = text.match(/(?:₹|rupees?|rs\.?)\s*(\d+(?:,\d+)*(?:\.\d+)?)/i) ||
            text.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:₹|rupees?|rs\.?)/i);
        if (priceMatch) {
            extractedInfo.price = parseFloat(priceMatch[1].replace(/,/g, ''));
        }

        // Try to extract stock quantity
        const stockMatch = text.match(/(\d+)\s*(?:pieces?|items?|units?|stock|quantity)/i);
        if (stockMatch) {
            extractedInfo.stock = parseInt(stockMatch[1]);
        }

        // Try to identify category
        const categories = ['clothing', 'jewelry', 'food', 'handicraft', 'home decor', 'electronics'];
        for (const cat of categories) {
            if (text.includes(cat)) {
                extractedInfo.category = cat.charAt(0).toUpperCase() + cat.slice(1);
                break;
            }
        }

        setExtractedData(extractedInfo);

        // Announce each field sequentially with delays
        if (extractedInfo.serialNumber) {
            await announceField('serialNumber', extractedInfo.serialNumber, 500);
        }
        await announceField('name', extractedInfo.name || 'Not specified', extractedInfo.serialNumber ? 0 : 500);
        await announceField('price', extractedInfo.price || 0, 0);
        await announceField('stock', extractedInfo.stock || 0, 0);
        await announceField('category', extractedInfo.category || 'General', 0);
        await announceField('description', 'Product details captured', 0);

        setStage("confirm");
        setIsProcessing(false);

        speak(t.voiceConfirm || `All fields filled. Should I add this product?`);
    };

    const handleConfirm = async () => {
        setIsProcessing(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError("You must be logged in to add products");
                setIsProcessing(false);
                return;
            }

            const { error: insertError } = await supabase
                .from('products')
                .insert([
                    {
                        name: extractedData.name || "Voice Product",
                        description: extractedData.description,
                        price: extractedData.price || 0,
                        stock: extractedData.stock || 0,
                        sold: 0,
                        image_url: '🎤',
                        category: extractedData.category || 'General',
                        user_id: user.id,
                    }
                ]);

            if (insertError) throw insertError;

            setStage("success");
            setSuccess(true);
            speak(t.voiceSuccess || "Product added successfully!");

            setTimeout(() => {
                onProductAdded();
                handleClose();
            }, 2000);
        } catch (err) {
            console.error('Error adding product:', err);
            setError(err instanceof Error ? err.message : 'Failed to add product');
            speak(t.voiceError || "Sorry, there was an error adding the product.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        window.speechSynthesis.cancel();
        setIsListening(false);
        setTranscript("");
        setExtractedData(null);
        setStage("listening");
        setError("");
        setSuccess(false);
        setCurrentField(null);
        setFilledFields([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Dialog */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-card rounded-2xl shadow-elevated border border-border overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border gradient-sunset">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-primary-foreground" />
                            <h2 className="font-display text-2xl font-bold text-primary-foreground">
                                {t.aiProductAssistant || "AI Product Assistant"}
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors text-primary-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Voice Visualization */}
                        <div className="flex flex-col items-center justify-center py-8">
                            <motion.button
                                onClick={toggleListening}
                                disabled={isProcessing}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${isListening
                                    ? "bg-red-500 shadow-glow-saffron animate-pulse"
                                    : "gradient-teal shadow-elevated"
                                    }`}
                            >
                                {isListening ? (
                                    <MicOff className="w-12 h-12 text-white" />
                                ) : (
                                    <Mic className="w-12 h-12 text-secondary-foreground" />
                                )}

                                {isListening && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-4 border-red-300"
                                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                )}
                            </motion.button>

                            <p className="mt-4 text-center text-muted-foreground">
                                {isListening
                                    ? t.listening || "Listening..."
                                    : t.clickToSpeak || "Click to start speaking"}
                            </p>
                        </div>

                        {/* Transcript Display */}
                        {transcript && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-lg bg-muted border border-border"
                            >
                                <p className="text-sm font-medium text-foreground mb-2">
                                    {t.transcript || "Transcript:"}
                                </p>
                                <p className="text-foreground">{transcript}</p>
                            </motion.div>
                        )}

                        {/* Processing Status */}
                        {stage === "processing" && currentField && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-lg bg-accent/10 border-2 border-accent/50 flex items-center gap-3"
                            >
                                <Loader2 className="w-5 h-5 text-accent animate-spin" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {selectedLanguage === 'hi' ? 'भर रहा हूं...' : 'Filling...'}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {currentField}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Extracted Data Preview */}
                        {(stage === "processing" || stage === "confirm") && extractedData && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-lg bg-secondary/10 border border-secondary/20 space-y-2"
                            >
                                <p className="text-sm font-medium text-foreground mb-3">
                                    {t.extractedInfo || "Extracted Information:"}
                                </p>
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                    {/* Serial Number Field */}
                                    {extractedData.serialNumber && (
                                        <motion.div
                                            className={`p-3 rounded-lg transition-all ${currentField === 'serialNumber'
                                                    ? 'bg-accent/20 border-2 border-accent shadow-glow-saffron'
                                                    : filledFields.includes('serialNumber')
                                                        ? 'bg-success/10 border border-success/30'
                                                        : 'bg-muted/50 border border-border'
                                                }`}
                                            animate={currentField === 'serialNumber' ? { scale: [1, 1.02, 1] } : {}}
                                            transition={{ duration: 0.5, repeat: currentField === 'serialNumber' ? Infinity : 0 }}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-muted-foreground font-medium text-xs">Serial #:</span>
                                                {filledFields.includes('serialNumber') && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="w-4 h-4 rounded-full bg-success flex items-center justify-center"
                                                    >
                                                        <Check className="w-3 h-3 text-white" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            <p className="font-medium text-foreground break-words">
                                                {extractedData.serialNumber}
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Name Field */}
                                    <motion.div
                                        className={`p-3 rounded-lg transition-all ${currentField === 'name'
                                                ? 'bg-accent/20 border-2 border-accent shadow-glow-saffron'
                                                : filledFields.includes('name')
                                                    ? 'bg-success/10 border border-success/30'
                                                    : 'bg-muted/50 border border-border'
                                            } ${extractedData.serialNumber ? '' : 'col-span-1'}`}
                                        animate={currentField === 'name' ? { scale: [1, 1.02, 1] } : {}}
                                        transition={{ duration: 0.5, repeat: currentField === 'name' ? Infinity : 0 }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-muted-foreground font-medium text-xs">Name:</span>
                                            {filledFields.includes('name') && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-4 h-4 rounded-full bg-success flex items-center justify-center"
                                                >
                                                    <Check className="w-3 h-3 text-white" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <p className="font-medium text-foreground break-words">
                                            {extractedData.name || "Not specified"}
                                        </p>
                                    </motion.div>

                                    {/* Price Field */}
                                    <motion.div
                                        className={`p-3 rounded-lg transition-all ${currentField === 'price'
                                                ? 'bg-accent/20 border-2 border-accent shadow-glow-saffron'
                                                : filledFields.includes('price')
                                                    ? 'bg-success/10 border border-success/30'
                                                    : 'bg-muted/50 border border-border'
                                            }`}
                                        animate={currentField === 'price' ? { scale: [1, 1.02, 1] } : {}}
                                        transition={{ duration: 0.5, repeat: currentField === 'price' ? Infinity : 0 }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-muted-foreground font-medium text-xs">Price:</span>
                                            {filledFields.includes('price') && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-4 h-4 rounded-full bg-success flex items-center justify-center"
                                                >
                                                    <Check className="w-3 h-3 text-white" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <p className="font-medium text-foreground">₹{extractedData.price || 0}</p>
                                    </motion.div>

                                    {/* Stock Field */}
                                    <motion.div
                                        className={`p-3 rounded-lg transition-all ${currentField === 'stock'
                                                ? 'bg-accent/20 border-2 border-accent shadow-glow-saffron'
                                                : filledFields.includes('stock')
                                                    ? 'bg-success/10 border border-success/30'
                                                    : 'bg-muted/50 border border-border'
                                            }`}
                                        animate={currentField === 'stock' ? { scale: [1, 1.02, 1] } : {}}
                                        transition={{ duration: 0.5, repeat: currentField === 'stock' ? Infinity : 0 }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-muted-foreground font-medium text-xs">Stock:</span>
                                            {filledFields.includes('stock') && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-4 h-4 rounded-full bg-success flex items-center justify-center"
                                                >
                                                    <Check className="w-3 h-3 text-white" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <p className="font-medium text-foreground">{extractedData.stock || 0} units</p>
                                    </motion.div>

                                    {/* Category Field */}
                                    <motion.div
                                        className={`p-3 rounded-lg transition-all ${currentField === 'category'
                                                ? 'bg-accent/20 border-2 border-accent shadow-glow-saffron'
                                                : filledFields.includes('category')
                                                    ? 'bg-success/10 border border-success/30'
                                                    : 'bg-muted/50 border border-border'
                                            }`}
                                        animate={currentField === 'category' ? { scale: [1, 1.02, 1] } : {}}
                                        transition={{ duration: 0.5, repeat: currentField === 'category' ? Infinity : 0 }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-muted-foreground font-medium text-xs">Category:</span>
                                            {filledFields.includes('category') && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-4 h-4 rounded-full bg-success flex items-center justify-center"
                                                >
                                                    <Check className="w-3 h-3 text-white" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <p className="font-medium text-foreground">{extractedData.category || "General"}</p>
                                    </motion.div>

                                    {/* Description Field */}
                                    <motion.div
                                        className={`p-3 rounded-lg transition-all col-span-3 ${currentField === 'description'
                                                ? 'bg-accent/20 border-2 border-accent shadow-glow-saffron'
                                                : filledFields.includes('description')
                                                    ? 'bg-success/10 border border-success/30'
                                                    : 'bg-muted/50 border border-border'
                                            }`}
                                        animate={currentField === 'description' ? { scale: [1, 1.02, 1] } : {}}
                                        transition={{ duration: 0.5, repeat: currentField === 'description' ? Infinity : 0 }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-muted-foreground font-medium text-xs">Description:</span>
                                            {filledFields.includes('description') && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-4 h-4 rounded-full bg-success flex items-center justify-center"
                                                >
                                                    <Check className="w-3 h-3 text-white" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <p className="font-medium text-foreground text-xs break-words line-clamp-2">
                                            {extractedData.description || "No description"}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-lg bg-success/10 border border-success/20 text-success flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                <span className="font-medium">{t.productAdded || "Product added successfully!"}</span>
                            </motion.div>
                        )}

                        {/* Actions */}
                        {stage === "confirm" && (
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setStage("listening");
                                        setTranscript("");
                                        setExtractedData(null);
                                    }}
                                    className="flex-1"
                                    disabled={isProcessing}
                                >
                                    {t.tryAgain || "Try Again"}
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    className="flex-1 gradient-teal text-secondary-foreground"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t.adding || "Adding..."}
                                        </>
                                    ) : (
                                        t.confirm || "Confirm & Add"
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
