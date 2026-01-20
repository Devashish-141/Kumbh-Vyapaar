import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Utensils, Car, Store, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeritageCard } from "@/components/HeritageCard";
import { FoodSpotCard } from "@/components/FoodSpotCard";

import panchavatiImg from "@/assets/panchavati.jpg";
import trimbakeshwarImg from "@/assets/trimbakeshwar.jpg";
import ramkundImg from "@/assets/ramkund.jpg";
import misalImg from "@/assets/misal.jpg";
import sabudanaImg from "@/assets/sabudana.jpg";
import thukpaImg from "@/assets/thukpa.jpg";

const heritageSpots = [
  {
    image: panchavatiImg,
    title: "Panchavati",
    location: "Old Nashik",
    duration: "2-3 hours",
    rating: 4.8,
    description: "Sacred grove where Lord Rama spent his exile. Home to the iconic Sita Gumpha cave and ancient temples.",
  },
  {
    image: trimbakeshwarImg,
    title: "Trimbakeshwar Temple",
    location: "30 km from Nashik",
    duration: "Half day",
    rating: 4.9,
    description: "One of the twelve Jyotirlingas, this ancient Shiva temple is a major pilgrimage destination.",
  },
  {
    image: ramkundImg,
    title: "Ram Kund",
    location: "Panchavati Area",
    duration: "1-2 hours",
    rating: 4.7,
    description: "Sacred bathing tank where devotees perform rituals. Believed to be where Lord Rama bathed.",
  },
];

const foodSpots = [
  {
    name: "Ambika Misal",
    specialty: "Nashik Style Misal",
    location: "Main Road, Panchavati",
    timing: "7:00 AM - 11:00 PM",
    priceRange: "₹60-100",
    image: misalImg,
  },
  {
    name: "Sadhana Restaurant",
    specialty: "Sabudana Khichdi",
    location: "College Road",
    timing: "8:00 AM - 10:00 PM",
    priceRange: "₹40-80",
    image: sabudanaImg,
  },
  {
    name: "Tibetan Kitchen",
    specialty: "Thukpa & Momos",
    location: "Tibetan Market Area",
    timing: "10:00 AM - 9:00 PM",
    priceRange: "₹80-150",
    image: thukpaImg,
  },
];

const parkingSpots = [
  { name: "Godavari Ghat Parking", type: "Government", capacity: 200, status: "available", occupancy: 45 },
  { name: "Panchavati Main Parking", type: "Government", capacity: 150, status: "moderate", occupancy: 72 },
  { name: "Ram Kund Private Lot", type: "Private", capacity: 80, status: "full", occupancy: 95 },
  { name: "Temple Road Parking", type: "Government", capacity: 120, status: "available", occupancy: 30 },
];

const VisitorPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState<"heritage" | "food" | "parking" | "market">("heritage");
  const navigate = useNavigate();

  const tabs = [
    { id: "heritage" as const, label: "Heritage", icon: MapPin },
    { id: "food" as const, label: "Food Trail", icon: Utensils },
    { id: "parking" as const, label: "Parking", icon: Car },
    { id: "market" as const, label: "Marketplace", icon: Store },
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
            <span className="text-sm">Back to Home</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Pilgrim Guide
            </h1>
            <p className="text-muted-foreground">
              Explore Nashik's sacred heritage, find parking, and discover local flavors
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
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                    isActive
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
                Sacred Sites
              </h2>
              <span className="text-sm text-muted-foreground">{heritageSpots.length} places</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heritageSpots.map((spot, index) => (
                <HeritageCard key={spot.title} {...spot} index={index} />
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
                Foodie Trail
              </h2>
              <span className="text-sm text-muted-foreground">{foodSpots.length} spots</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {foodSpots.map((spot, index) => (
                <FoodSpotCard key={spot.name} {...spot} index={index} />
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
                Smart Parking
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-success" />
                  Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-warning" />
                  Moderate
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-danger" />
                  Full
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
                      className={`w-4 h-4 rounded-full ${
                        spot.status === "available"
                          ? "bg-success"
                          : spot.status === "moderate"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    />
                    <div>
                      <h3 className="font-medium text-foreground">{spot.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {spot.type} • {spot.capacity} spots
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">{spot.occupancy}%</p>
                    <p className="text-xs text-muted-foreground">Occupied</p>
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
              Marketplace Coming Soon
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Browse products from local vendors including the famous Tibetan Market and Saraf Bazaar jewelry shops.
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
                className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
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
