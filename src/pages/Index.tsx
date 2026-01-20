import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Compass, Store, Sparkles, Users, MapPin, Languages } from "lucide-react";
import { Header } from "@/components/Header";
import { RoleCard } from "@/components/RoleCard";
import heroImage from "@/assets/hero-ghat.jpg";

const translations: Record<string, { hero: string; subtitle: string; visitor: string; merchant: string; visitorDesc: string; merchantDesc: string; features: string[]; powered: string }> = {
  en: {
    hero: "Discover Nashik",
    subtitle: "Your AI-powered guide to sacred heritage, vibrant markets, and authentic experiences",
    visitor: "I'm a Visitor",
    merchant: "I'm a Business Owner",
    visitorDesc: "Explore temples, find parking, discover food trails, and shop local - all in your language",
    merchantDesc: "List your products, reach pilgrims nationwide, and grow your business with AI-powered tools",
    features: ["22+ Languages", "50,000+ Visitors Daily", "500+ Local Vendors", "AI-Powered"],
    powered: "Powered by AI Translation",
  },
  hi: {
    hero: "नाशिक की खोज करें",
    subtitle: "पवित्र विरासत, जीवंत बाज़ारों और प्रामाणिक अनुभवों के लिए आपका AI-संचालित मार्गदर्शक",
    visitor: "मैं एक आगंतुक हूं",
    merchant: "मैं एक व्यापारी हूं",
    visitorDesc: "मंदिर देखें, पार्किंग खोजें, फूड ट्रेल खोजें, और स्थानीय खरीदारी करें - अपनी भाषा में",
    merchantDesc: "अपने उत्पाद सूचीबद्ध करें, देशभर के तीर्थयात्रियों तक पहुंचें, AI-संचालित टूल्स से अपना व्यापार बढ़ाएं",
    features: ["22+ भाषाएं", "50,000+ दैनिक आगंतुक", "500+ स्थानीय विक्रेता", "AI-संचालित"],
    powered: "AI अनुवाद द्वारा संचालित",
  },
  mr: {
    hero: "नाशिक शोधा",
    subtitle: "पवित्र वारसा, दोलायमान बाजार आणि अस्सल अनुभवांसाठी तुमचा AI-संचालित मार्गदर्शक",
    visitor: "मी एक पर्यटक आहे",
    merchant: "मी एक व्यापारी आहे",
    visitorDesc: "मंदिरे पहा, पार्किंग शोधा, खाद्य मार्ग शोधा, आणि स्थानिक खरेदी करा - तुमच्या भाषेत",
    merchantDesc: "तुमची उत्पादने सूचीबद्ध करा, देशभरातील यात्रेकरूंपर्यंत पोहोचा, AI-संचालित साधनांसह तुमचा व्यवसाय वाढवा",
    features: ["22+ भाषा", "50,000+ दैनिक पर्यटक", "500+ स्थानिक विक्रेते", "AI-संचालित"],
    powered: "AI अनुवादाद्वारे संचालित",
  },
  ta: {
    hero: "நாசிக்கை கண்டறியுங்கள்",
    subtitle: "புனித பாரம்பரியம், உயிரான சந்தைகள் மற்றும் உண்மையான அனுபவங்களுக்கான உங்கள் AI-இயக்கப்படும் வழிகாட்டி",
    visitor: "நான் ஒரு பார்வையாளர்",
    merchant: "நான் ஒரு வணிக உரிமையாளர்",
    visitorDesc: "கோவில்களை ஆராயுங்கள், நிறுத்துமிடம் கண்டறியுங்கள், உணவு வழிகளை கண்டுபிடியுங்கள் - உங்கள் மொழியில்",
    merchantDesc: "உங்கள் தயாரிப்புகளை பட்டியலிடுங்கள், தேசிய யாத்ரீகர்களை சென்றடையுங்கள், AI கருவிகளுடன் வளருங்கள்",
    features: ["22+ மொழிகள்", "50,000+ தினசரி பார்வையாளர்கள்", "500+ உள்ளூர் விற்பனையாளர்கள்", "AI-இயக்கப்படுகிறது"],
    powered: "AI மொழிபெயர்ப்பால் இயக்கப்படுகிறது",
  },
};

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const navigate = useNavigate();
  const t = translations[selectedLanguage] || translations.en;

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
              subtitle="Pilgrim Mode"
              description={t.visitorDesc}
              variant="visitor"
              onClick={() => navigate("/visitor")}
            />
            <RoleCard
              icon={Store}
              title={t.merchant}
              subtitle="Merchant Hub"
              description={t.merchantDesc}
              variant="merchant"
              onClick={() => navigate("/merchant")}
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

      {/* Quick Stats Section */}
      <section className="py-16 bg-sacred">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "22+", label: "Languages Supported" },
              { value: "50K+", label: "Daily Visitors" },
              { value: "500+", label: "Local Vendors" },
              { value: "100%", label: "AI Powered" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-display font-bold text-gradient-saffron mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
