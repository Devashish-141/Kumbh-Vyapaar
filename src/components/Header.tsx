import { motion } from "framer-motion";
import { LanguagePicker } from "./LanguagePicker";
import { Menu, X } from "lucide-react";
import { useState } from "react";

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

  const isTransparent = variant === "transparent";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isTransparent
          ? "bg-transparent"
          : "bg-card/80 backdrop-blur-lg border-b border-border"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2"
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
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Heritage", "Marketplace", "Parking", "Food Trail"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                whileHover={{ y: -2 }}
                className={`text-sm font-medium transition-colors ${
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </motion.a>
            ))}
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
              className={`md:hidden p-2 rounded-lg ${
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-card/95 backdrop-blur-lg border-t border-border"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {["Heritage", "Marketplace", "Parking", "Food Trail"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
