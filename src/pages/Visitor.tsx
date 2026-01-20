import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Utensils, Car, Store, ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeritageCard } from "@/components/HeritageCard";
import { FoodSpotCard } from "@/components/FoodSpotCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

import panchavatiImg from "@/assets/panchavati.jpg";
import trimbakeshwarImg from "@/assets/trimbakeshwar.jpg";
import ramkundImg from "@/assets/ramkund.jpg";
import kalaramImg from "@/assets/kalaram.png";
import saptashrungiImg from "@/assets/saptashrungi.png";
import muktidhamImg from "@/assets/muktidham.png";
import misalImg from "@/assets/misal.jpg";
import sabudanaImg from "@/assets/sabudana.jpg";
import thukpaImg from "@/assets/thukpa.jpg";
import sadhanaImg from "@/assets/sadhana_misal.png";
import alArabianImg from "@/assets/al_arabian.png";
import sayantaraImg from "@/assets/sayantara.png";
import vijusImg from "@/assets/vijus_dabeli.png";
import kondajiImg from "@/assets/kondaji_chivda.png";
import ambikaImg from "@/assets/ambika_misal.png";
import pandavLeniImg from "@/assets/pandav_leni.png";
import phalkeSmarakImg from "@/assets/phalke_smarak.png";
import sulaVineyardsImg from "@/assets/sula_vineyards.png";
import someshwarImg from "@/assets/someshwar_waterfall.png";
import artilleryMuseumImg from "@/assets/artillery_museum.png";
import coinMuseumImg from "@/assets/coin_museum.png";

const VisitorPage = () => {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<"heritage" | "food" | "parking" | "market" | "places">("heritage");
  const navigate = useNavigate();
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const openDirections = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
  };

  const heritageSpots = [
    {
      image: trimbakeshwarImg,
      title: t.trimbakeshwar,
      location: t.trimbakeshwarLocation,
      duration: t.trimbakeshwarDuration,
      rating: 4.9,
      description: t.trimbakeshwarDesc,
    },
    {
      image: kalaramImg,
      title: t.kalaram,
      location: t.kalaramLocation,
      duration: t.kalaramDuration,
      rating: 4.8,
      description: t.kalaramDesc,
    },
    {
      image: ramkundImg,
      title: t.ramKund,
      location: t.ramKundLocation,
      duration: t.ramKundDuration,
      rating: 4.7,
      description: t.ramKundDesc,
    },
    {
      image: saptashrungiImg,
      title: t.saptashrungi,
      location: t.saptashrungiLocation,
      duration: t.saptashrungiDuration,
      rating: 4.9,
      description: t.saptashrungiDesc,
    },
    {
      image: muktidhamImg,
      title: t.muktidham,
      location: t.muktidhamLocation,
      duration: t.muktidhamDuration,
      rating: 4.6,
      description: t.muktidhamDesc,
    },
  ];

  const foodSpots = [
    {
      name: t.sadhanaName,
      specialty: t.sadhanaSpecialty,
      location: t.sadhanaLocation,
      timing: t.sadhanaTiming,
      priceRange: "₹200-300",
      image: sadhanaImg,
      description: t.sadhanaDesc,
    },
    {
      name: t.alArabianName,
      specialty: t.alArabianSpecialty,
      location: t.alArabianLocation,
      timing: t.alArabianTiming,
      priceRange: "₹800-1000",
      image: alArabianImg,
      description: t.alArabianDesc,
    },
    {
      name: t.sayantaraName,
      specialty: t.sayantaraSpecialty,
      location: t.sayantaraLocation,
      timing: t.sayantaraTiming,
      priceRange: "₹150-200",
      image: sayantaraImg,
      description: t.sayantaraDesc,
    },
    {
      name: t.vijusName,
      specialty: t.vijusSpecialty,
      location: t.vijusLocation,
      timing: t.vijusTiming,
      priceRange: "₹200-300",
      image: vijusImg,
      description: t.vijusDesc,
    },
    {
      name: t.kondajiName,
      specialty: t.kondajiSpecialty,
      location: t.kondajiLocation,
      timing: t.kondajiTiming,
      priceRange: "₹150-300",
      image: kondajiImg,
      description: t.kondajiDesc,
    },
    {
      name: t.ambikaName,
      specialty: t.ambikaSpecialty,
      location: t.ambikaLocation,
      timing: t.ambikaTiming,
      priceRange: "₹200-300",
      image: ambikaImg,
      description: t.ambikaDesc,
    },
  ];

  const parkingSpots = [
    { name: t.godavariParking, type: t.government, capacity: 200, status: "available", occupancy: 45 },
    { name: t.panchavatiParking, type: t.government, capacity: 150, status: "moderate", occupancy: 72 },
    { name: t.ramKundParking, type: t.private, capacity: 80, status: "full", occupancy: 95 },
    { name: t.templeParking, type: t.government, capacity: 120, status: "available", occupancy: 30 },
  ];

  const famousPlaces = [
    {
      image: pandavLeniImg,
      title: t.pandavLeni,
      location: t.pandavLeniLocation,
      duration: t.pandavLeniDuration,
      rating: 4.7,
      description: t.pandavLeniDesc,
    },
    {
      image: phalkeSmarakImg,
      title: t.phalkeSmarak,
      location: t.phalkeSmarakLocation,
      duration: t.phalkeSmarakDuration,
      rating: 4.6,
      description: t.phalkeSmarakDesc,
    },
    {
      image: sulaVineyardsImg,
      title: t.sulaVineyards,
      location: t.sulaVineyardsLocation,
      duration: t.sulaVineyardsDuration,
      rating: 4.8,
      description: t.sulaVineyardsDesc,
    },
    {
      image: someshwarImg,
      title: t.someshwar,
      location: t.someshwarLocation,
      duration: t.someshwarDuration,
      rating: 4.5,
      description: t.someshwarDesc,
    },
    {
      image: artilleryMuseumImg,
      title: t.artilleryMuseum,
      location: t.artilleryMuseumLocation,
      duration: t.artilleryMuseumDuration,
      rating: 4.6,
      description: t.artilleryMuseumDesc,
    },
    {
      image: coinMuseumImg,
      title: t.coinMuseum,
      location: t.coinMuseumLocation,
      duration: t.coinMuseumDuration,
      rating: 4.4,
      description: t.coinMuseumDesc,
    },
  ];

  const tabs = [
    { id: "heritage" as const, label: t.heritage, icon: MapPin },
    { id: "places" as const, label: t.places, icon: Camera },
    { id: "food" as const, label: t.foodTrail, icon: Utensils },
    { id: "parking" as const, label: t.parking, icon: Car },
    { id: "market" as const, label: t.marketplace, icon: Store },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        variant="solid"
      />

      {/* Back Button & Title */}
      <div className="pt-24 pb-8 bg-gradient-sacred">
        <div className="container mx-auto px-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t.backToHome}</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t.pilgrimGuide}
            </h1>
            <p className="text-muted-foreground">
              {t.pilgrimSubtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 md:top-20 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-4 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${isActive
                    ? "gradient-saffron text-primary-foreground shadow-glow-saffron"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "heritage" && (
          <motion.div
            key="heritage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {t.sacredSites}
              </h2>
              <span className="text-sm text-muted-foreground">{heritageSpots.length} {t.places}</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heritageSpots.map((spot, index) => (
                <HeritageCard
                  key={spot.title}
                  {...spot}
                  index={index}
                  onDirectionClick={() => openDirections(`${spot.title} ${spot.location}`)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "places" && (
          <motion.div
            key="places"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {t.places}
              </h2>
              <span className="text-sm text-muted-foreground">{famousPlaces.length} {t.places}</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {famousPlaces.map((spot, index) => (
                <HeritageCard
                  key={spot.title}
                  {...spot}
                  index={index}
                  onDirectionClick={() => openDirections(`${spot.title} ${spot.location}`)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "food" && (
          <motion.div
            key="food"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {t.foodieTrail}
              </h2>
              <span className="text-sm text-muted-foreground">{foodSpots.length} {t.spots}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {foodSpots.map((spot, index) => (
                <FoodSpotCard
                  key={spot.name}
                  {...spot}
                  index={index}
                  onDirectionClick={() => openDirections(`${spot.name} ${spot.location}`)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "parking" && (
          <motion.div
            key="parking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {t.smartParking}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-success" />
                  {t.available}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-warning" />
                  {t.moderate}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-danger" />
                  {t.full}
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              {parkingSpots.map((spot, index) => (
                <motion.div
                  key={spot.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-soft"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-4 h-4 rounded-full ${spot.status === "available"
                        ? "bg-success"
                        : spot.status === "moderate"
                          ? "bg-warning"
                          : "bg-danger"
                        }`}
                    />
                    <div>
                      <h3 className="font-medium text-foreground">{spot.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {spot.type} • {spot.capacity} {t.spotsLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">{spot.occupancy}%</p>
                      <p className="text-xs text-muted-foreground">{t.occupied}</p>
                    </div>
                    <button
                      onClick={() => openDirections(spot.name)}
                      className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      Map
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "market" && (
          <motion.div
            key="market"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
              {t.marketplaceSoon}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t.marketplaceDesc}
            </p>
          </motion.div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
        <div className="flex justify-around py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default VisitorPage;
