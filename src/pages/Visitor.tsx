import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Utensils, Car, Store, ArrowLeft, Camera, Phone, Clock, Package, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { HeritageCard } from "@/components/HeritageCard";
import { FoodSpotCard } from "@/components/FoodSpotCard";
import { StudentGuideCard } from "@/components/StudentGuideCard";
import { GuideEnrollDialog } from "@/components/GuideEnrollDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { supabase } from "@/lib/supabase";

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
  const [activeTab, setActiveTab] = useState<"heritage" | "food" | "parking" | "market" | "places" | "guides">("heritage");
  const [stores, setStores] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const navigate = useNavigate();
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  useEffect(() => {
    if (activeTab === "market") {
      fetchStores();
    }
    if (activeTab === "guides") {
      fetchGuides();
    }
  }, [activeTab]);

  const fetchGuides = async () => {
    setIsLoadingGuides(true);
    try {
      const { data, error } = await supabase
        .from('student_guides')
        .select('*')
        .eq('is_verified', true);

      if (error) throw error;
      if (data && data.length > 0) {
        setGuides(data);
      } else {
        // Fallback to initial mock data if DB is empty
        setGuides(initialGuides);
      }
    } catch (error) {
      console.error('Error fetching guides:', error);
      setGuides(initialGuides);
    } finally {
      setIsLoadingGuides(false);
    }
  };

  const fetchStores = async () => {
    setIsLoadingStores(true);
    try {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          products:products(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setStores(data);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setIsLoadingStores(false);
    }
  };

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

  const initialGuides = [
    {
      name: "Rahul Deshmukh",
      college: "KTHM College",
      age: 21,
      languages: ["English", "Hindi", "Marathi"],
      specialization: "History & Architecture of ancient Nashik temples",
      dailyRate: "500",
      studentId: "N-2024-042",
      verified: true
    },
    {
      name: "Priyanka Patil",
      college: "RYK College of Science",
      age: 20,
      languages: ["English", "Hindi", "Marathi", "Gujarati"],
      specialization: "Godavari Ghat traditions and cultural heritage",
      dailyRate: "600",
      studentId: "N-2024-115",
      verified: true
    },
    {
      name: "Aniket Shinde",
      college: "Sandip Foundation",
      age: 22,
      languages: ["English", "Hindi", "Marathi", "Tamil"],
      specialization: "Panchavati food trails and local market history",
      dailyRate: "450",
      studentId: "N-2024-089",
      verified: true
    }
  ];

  const tabs = [
    { id: "heritage" as const, label: t.heritage, icon: MapPin },
    { id: "places" as const, label: t.places, icon: Camera },
    { id: "food" as const, label: t.foodTrail, icon: Utensils },
    { id: "guides" as const, label: t.studentGuides, icon: Users },
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

        {activeTab === "guides" && (
          <motion.div
            key="guides"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {t.hireGuide}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {t.guideDesc}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsEnrollDialogOpen(true)}
                  variant="outline"
                  className="border-saffron text-saffron hover:bg-saffron/5 font-semibold"
                >
                  Apply as Guide
                </Button>
                <span className="text-sm bg-muted px-4 py-2 rounded-full text-muted-foreground">
                  {guides.length} {t.studentGuides}
                </span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <StudentGuideCard
                  key={guide.studentId || guide.id}
                  name={guide.full_name || guide.name}
                  college={guide.college_name || guide.college}
                  age={guide.age}
                  languages={guide.languages_spoken || guide.languages}
                  specialization={Array.isArray(guide.specialization) ? guide.specialization[0] : guide.specialization}
                  dailyRate={guide.daily_rate?.toString() || guide.dailyRate}
                  studentId={guide.student_id || guide.studentId}
                  verified={guide.is_verified ?? guide.verified}
                  t={t}
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
          >
            {isLoadingStores ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading stores...</p>
              </div>
            ) : stores.length === 0 ? (
              <div className="text-center py-16">
                <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                  No Stores Available
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Merchants haven't set up their stores yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store, index) => (
                  <motion.div
                    key={store.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-xl border border-border overflow-hidden shadow-soft hover:shadow-elevated transition-all"
                  >
                    {/* Store Image */}
                    <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                      {store.store_image_url && store.store_image_url.startsWith('http') ? (
                        <img
                          src={store.store_image_url}
                          alt={store.store_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">{store.store_image_url || '🏪'}</span>
                      )}
                    </div>

                    {/* Store Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground mb-1">
                          {store.store_name}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {store.category}
                        </p>
                      </div>

                      {store.description && (
                        <p className="text-sm text-foreground line-clamp-2">
                          {store.description}
                        </p>
                      )}

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${store.is_open
                          ? 'bg-success/10 text-success'
                          : 'bg-danger/10 text-danger'
                          }`}>
                          {store.is_open ? '● Open' : '● Closed'}
                        </span>
                        {store.opening_hours && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {store.opening_hours}
                          </span>
                        )}
                      </div>

                      {/* Products Count */}
                      {store.products && store.products.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Package className="w-4 h-4" />
                          <span>{store.products[0].count || 0} products available</span>
                        </div>
                      )}

                      {/* Contact & Location */}
                      <div className="space-y-2 pt-2 border-t border-border">
                        {store.phone && (
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <a href={`tel:${store.phone}`} className="hover:text-primary transition-colors">
                              {store.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-start gap-2 text-sm text-foreground">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p>{store.address}</p>
                            {store.landmark && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Near {store.landmark}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => navigate(`/store/${store.id}`)}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                          <Package className="w-4 h-4" />
                          View Products
                        </button>
                        <button
                          onClick={() => openDirections(`${store.store_name}, ${store.address}`)}
                          className="px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
        <div className="flex overflow-x-auto items-center py-2 px-2 no-scrollbar gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 min-w-[70px] px-2 py-1 rounded-lg transition-all ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                <span className="text-[10px] font-medium whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      <GuideEnrollDialog
        isOpen={isEnrollDialogOpen}
        onClose={() => {
          setIsEnrollDialogOpen(false);
          fetchGuides();
        }}
        t={t}
      />
    </div>
  );
};

export default VisitorPage;
