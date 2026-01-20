import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown, Search } from "lucide-react";
import { SUPPORTED_LANGUAGES, LANGUAGES_BY_REGION, getLanguageByCode } from "@/lib/languages";

interface LanguagePickerProps {
    selectedLanguage: string;
    onLanguageChange: (code: string) => void;
    variant?: "light" | "dark";
}

export function LanguagePicker({
    selectedLanguage,
    onLanguageChange,
    variant = "light",
}: LanguagePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const selected = getLanguageByCode(selectedLanguage) || SUPPORTED_LANGUAGES[0];

    const baseClasses = variant === "light"
        ? "bg-card/90 backdrop-blur-md border-border text-foreground"
        : "bg-secondary/90 backdrop-blur-md border-secondary text-secondary-foreground";

    const buttonClasses = variant === "light"
        ? "bg-card/80 backdrop-blur-sm border-border/50 text-foreground hover:bg-card"
        : "bg-secondary/50 backdrop-blur-sm border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary/70";

    // Filter languages based on search
    const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${buttonClasses}`}
            >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{selected.nativeName}</span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`absolute right-0 top-full mt-2 w-80 max-h-96 rounded-xl border z-50 shadow-elevated ${baseClasses}`}
                        >
                            {/* Search Bar */}
                            <div className="p-3 border-b border-border sticky top-0 bg-inherit">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search languages..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>

                            {/* Language List */}
                            <div className="overflow-y-auto max-h-80 p-2">
                                {searchQuery ? (
                                    // Show filtered results
                                    <div className="grid grid-cols-1 gap-1">
                                        {filteredLanguages.map((lang) => (
                                            <motion.button
                                                key={lang.code}
                                                whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                                                onClick={() => {
                                                    onLanguageChange(lang.code);
                                                    setIsOpen(false);
                                                    setSearchQuery("");
                                                }}
                                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${selectedLanguage === lang.code
                                                        ? "bg-primary/10 text-primary"
                                                        : "hover:bg-muted"
                                                    }`}
                                            >
                                                <div>
                                                    <p className="font-medium text-sm">{lang.nativeName}</p>
                                                    <p className="text-xs text-muted-foreground">{lang.name}</p>
                                                </div>
                                                {selectedLanguage === lang.code && (
                                                    <Check className="w-4 h-4 text-primary" />
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                ) : (
                                    // Show grouped by region
                                    <div className="space-y-4">
                                        {Object.entries(LANGUAGES_BY_REGION).map(([region, langs]) => (
                                            langs.length > 0 && (
                                                <div key={region}>
                                                    <p className="text-xs font-semibold text-muted-foreground px-2 mb-1">
                                                        {region}
                                                    </p>
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {langs.map((lang) => (
                                                            <motion.button
                                                                key={lang.code}
                                                                whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                                                                onClick={() => {
                                                                    onLanguageChange(lang.code);
                                                                    setIsOpen(false);
                                                                }}
                                                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${selectedLanguage === lang.code
                                                                        ? "bg-primary/10 text-primary"
                                                                        : "hover:bg-muted"
                                                                    }`}
                                                            >
                                                                <div>
                                                                    <p className="font-medium text-sm">{lang.nativeName}</p>
                                                                    <p className="text-xs text-muted-foreground">{lang.name}</p>
                                                                </div>
                                                                {selectedLanguage === lang.code && (
                                                                    <Check className="w-4 h-4 text-primary" />
                                                                )}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
