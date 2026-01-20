import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "sd", name: "Sindhi", native: "سنڌي" },
  { code: "ks", name: "Kashmiri", native: "कॉशुर" },
  { code: "doi", name: "Dogri", native: "डोगरी" },
  { code: "mni", name: "Manipuri", native: "মৈতৈলোন্" },
  { code: "sat", name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "kok", name: "Konkani", native: "कोंकणी" },
  { code: "bodo", name: "Bodo", native: "बड़ो" },
];

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
  const selected = languages.find((l) => l.code === selectedLanguage) || languages[0];

  const baseClasses = variant === "light" 
    ? "bg-card/90 backdrop-blur-md border-border text-foreground" 
    : "bg-secondary/90 backdrop-blur-md border-secondary text-secondary-foreground";

  const buttonClasses = variant === "light"
    ? "bg-card/80 backdrop-blur-sm border-border/50 text-foreground hover:bg-card"
    : "bg-secondary/50 backdrop-blur-sm border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary/70";

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${buttonClasses}`}
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{selected.native}</span>
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
              className={`absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto rounded-xl border p-2 z-50 shadow-elevated ${baseClasses}`}
            >
              <div className="grid grid-cols-2 gap-1">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                      selectedLanguage === lang.code
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm">{lang.native}</p>
                      <p className="text-xs text-muted-foreground">{lang.name}</p>
                    </div>
                    {selectedLanguage === lang.code && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
