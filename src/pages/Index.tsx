import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Compass, Store, Sparkles, Users, MapPin, Languages } from "lucide-react";
import { Header } from "@/components/Header";
import { RoleCard } from "@/components/RoleCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import heroImage from "@/assets/hero-ghat.jpg";

const Index = () => {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const navigate = useNavigate();
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const featureIcons = [Languages, Users, Store, Sparkles];

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        variant="transparent"
      />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={heroImage}
            alt="Nashik Godavari Ghat"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/20 to-foreground/70" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-md px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-card">{t.powered}</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-card mb-6 tracking-tight">
              <AnimatePresence mode="wait">
                <motion.span
                  key={selectedLanguage + "-hero"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {t.hero}
                </motion.span>
              </AnimatePresence>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-card/90 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              {t.subtitle}
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {t.features.map((feature, index) => {
                const Icon = featureIcons[index];
                return (
                  <motion.div
                    key={feature}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 bg-card/10 backdrop-blur-sm border border-card/20 px-4 py-2 rounded-full"
                  >
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-card">{feature}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Role Selection Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            <RoleCard
              icon={Compass}
              title={t.visitor}
              subtitle={t.pilgrimMode}
              description={t.visitorDesc}
              variant="visitor"
              onClick={() => navigate("/visitor")}
              getStartedText={t.getStarted}
            />
            <RoleCard
              icon={Store}
              title={t.merchant}
              subtitle={t.merchantHubLabel}
              description={t.merchantDesc}
              variant="merchant"
              onClick={() => navigate("/merchant")}
              getStartedText={t.getStarted}
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-card/50 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-card rounded-full" />
          </motion.div>
        </motion.div>
      </section>


    </div>
  );
};

export default Index;
