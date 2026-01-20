import { motion } from "framer-motion";
import { LanguagePicker } from "./LanguagePicker";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  variant?: "transparent" | "solid";
}

export function Header({
  selectedLanguage,
  onLanguageChange,
  variant = "transparent",
}: HeaderProps) {
  const navigate = useNavigate();
  const { selectedLanguage: lang } = useLanguage();
  const t = translations[lang as keyof typeof translations] || translations.en;

  const isTransparent = variant === "transparent";



  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 ${isTransparent
        ? "bg-transparent"
        : "bg-card/80 backdrop-blur-lg border-b border-border"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Now Clickable */}
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">
                क
              </span>
            </div>
            <div className={isTransparent ? "text-white" : "text-foreground"}>
              <h1 className="font-display font-semibold text-lg leading-tight">
                Kumbh-Vyapaar
              </h1>
              <p className="text-xs opacity-80">AI Commerce</p>
            </div>
          </motion.button>

          {/* Desktop Navigation - Translated */}


          {/* Right Side */}
          <div className="flex items-center gap-4">
            <LanguagePicker
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              variant={isTransparent ? "dark" : "light"}
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
