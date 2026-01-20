import { motion } from "framer-motion";
import { LanguagePicker } from "./LanguagePicker";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLanguage: lang } = useLanguage();
  const t = translations[lang as keyof typeof translations] || translations.en;

  const isTransparent = variant === "transparent";

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);

    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // We're on home page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

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
          <nav className="hidden md:flex items-center gap-8">
            <motion.button
              onClick={() => handleNavClick('heritage')}
              whileHover={{ y: -2 }}
              className={`text-sm font-medium transition-colors ${isTransparent
                ? "text-white/90 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t.heritage}
            </motion.button>
            <motion.button
              onClick={() => handleNavClick('marketplace')}
              whileHover={{ y: -2 }}
              className={`text-sm font-medium transition-colors ${isTransparent
                ? "text-white/90 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t.marketplace}
            </motion.button>
            <motion.button
              onClick={() => handleNavClick('parking')}
              whileHover={{ y: -2 }}
              className={`text-sm font-medium transition-colors ${isTransparent
                ? "text-white/90 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t.parking}
            </motion.button>
            <motion.button
              onClick={() => handleNavClick('food-trail')}
              whileHover={{ y: -2 }}
              className={`text-sm font-medium transition-colors ${isTransparent
                ? "text-white/90 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t.foodTrail}
            </motion.button>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <LanguagePicker
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              variant={isTransparent ? "dark" : "light"}
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${isTransparent
                ? "text-white hover:bg-white/10"
                : "text-foreground hover:bg-muted"
                }`}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Translated */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-card/95 backdrop-blur-lg border-t border-border"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('heritage')}
              className="px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors text-left"
            >
              {t.heritage}
            </button>
            <button
              onClick={() => handleNavClick('marketplace')}
              className="px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors text-left"
            >
              {t.marketplace}
            </button>
            <button
              onClick={() => handleNavClick('parking')}
              className="px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors text-left"
            >
              {t.parking}
            </button>
            <button
              onClick={() => handleNavClick('food-trail')}
              className="px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors text-left"
            >
              {t.foodTrail}
            </button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
