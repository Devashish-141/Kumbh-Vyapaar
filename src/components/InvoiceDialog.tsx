import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Loader2, FileText, User, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    sold: number;
    image_url: string;
    category?: string;
}

interface InvoiceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export const InvoiceDialog = ({ isOpen, onClose, product }: InvoiceDialogProps) => {
    const { selectedLanguage } = useLanguage();
    const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

    const [isGenerating, setIsGenerating] = useState(false);
    const [customerData, setCustomerData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        quantity: 1,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomerData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateInvoice = async () => {
        setIsGenerating(true);
        try {
            await generateInvoicePDF({
                customer: {
                    name: customerData.name,
                    email: customerData.email,
                    phone: customerData.phone,
                    address: customerData.address,
                },
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: customerData.quantity,
                },
            });

            // Reset form and close
            setTimeout(() => {
                setCustomerData({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    quantity: 1,
                });
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Error generating invoice:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const totalAmount = product.price * customerData.quantity;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
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
                    <div className="flex items-center justify-between p-6 border-b border-border gradient-saffron">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-primary-foreground" />
                            <h2 className="font-display text-2xl font-bold text-primary-foreground">
                                Generate Invoice
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors text-primary-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        {/* Product Summary */}
                        <div className="p-4 rounded-lg bg-muted border border-border">
                            <h3 className="font-semibold text-foreground mb-2">Product Details</h3>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl">{product.image_url}</div>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">₹{product.price.toLocaleString()}</p>
                                    {product.category && (
                                        <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Customer Information
                            </h3>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Customer Name <span className="text-danger">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={customerData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="Enter customer name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Email <span className="text-danger">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={customerData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="customer@email.com"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Phone Number <span className="text-danger">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={customerData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Address <span className="text-danger">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                    <textarea
                                        name="address"
                                        value={customerData.address}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                                        placeholder="Enter full address"
                                    />
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Quantity <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={customerData.quantity}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    max={product.stock}
                                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Available stock: {product.stock}
                                </p>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-foreground">Total Amount:</span>
                                <span className="text-2xl font-bold text-primary">
                                    ₹{totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 p-6 border-t border-border bg-muted/30">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isGenerating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleGenerateInvoice}
                            className="flex-1 gradient-saffron text-primary-foreground gap-2"
                            disabled={isGenerating || !customerData.name || !customerData.email || !customerData.phone || !customerData.address}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Generate PDF Invoice
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
