import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  BarChart3,
  FileText,
  Settings,
  Plus,
  TrendingUp,
  Users,
  IndianRupee,
  Mic,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

const mockProducts = [
  {
    id: 1,
    name: "Tibetan Wool Shawl",
    nameHi: "तिब्बती ऊन शॉल",
    price: 1200,
    sold: 45,
    stock: 23,
    image: "🧣",
  },
  {
    id: 2,
    name: "Silver Nose Ring",
    nameHi: "चांदी की नथ",
    price: 850,
    sold: 89,
    stock: 12,
    image: "💍",
  },
  {
    id: 3,
    name: "Handwoven Carpet",
    nameHi: "हाथ से बुना कालीन",
    price: 4500,
    sold: 12,
    stock: 8,
    image: "🪢",
  },
];

const MerchantPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [activeSection, setActiveSection] = useState<"dashboard" | "products" | "invoices" | "settings">("dashboard");
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();

  const stats = [
    { label: "Today's Sales", value: "₹12,450", icon: IndianRupee, change: "+12%" },
    { label: "Total Orders", value: "34", icon: Package, change: "+8%" },
    { label: "New Customers", value: "12", icon: Users, change: "+25%" },
    { label: "Conversion Rate", value: "3.2%", icon: TrendingUp, change: "+5%" },
  ];

  const menuItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
    { id: "products" as const, label: "Products", icon: Package },
    { id: "invoices" as const, label: "Invoices", icon: FileText },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        variant="solid"
      />

      <div className="flex pt-16 md:pt-20">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-5rem)] bg-card border-r border-border p-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </motion.button>

          <div className="mb-8">
            <h2 className="font-display text-xl font-bold text-foreground">Merchant Hub</h2>
            <p className="text-sm text-muted-foreground">Manage your business</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    isActive
                      ? "gradient-teal text-secondary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </motion.button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Mobile Header */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="font-display text-2xl font-bold text-foreground">Merchant Hub</h1>
          </div>

          {activeSection === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card p-5 rounded-xl border border-border shadow-soft"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-secondary/10">
                          <Icon className="w-5 h-5 text-secondary" />
                        </div>
                        <span className="text-xs font-medium text-success bg-success-light px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* AI Product Assistant */}
              <div className="bg-gradient-to-r from-secondary to-teal-light p-6 rounded-2xl text-secondary-foreground">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary-foreground/10 rounded-xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold mb-2">
                      AI Product Assistant
                    </h3>
                    <p className="text-secondary-foreground/80 text-sm mb-4">
                      Speak in Marathi or Hindi to create multilingual product listings instantly
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsRecording(!isRecording)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                        isRecording
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-secondary-foreground text-secondary"
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      {isRecording ? "Recording..." : "Start Speaking"}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Recent Products */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Your Products
                  </h2>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add New
                  </Button>
                </div>

                <div className="grid gap-4">
                  {mockProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-soft hover:shadow-elevated transition-shadow"
                    >
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.nameHi}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₹{product.price}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sold} sold • {product.stock} in stock
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection !== "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              {activeSection === "products" && <Package className="w-16 h-16 text-muted-foreground mb-4" />}
              {activeSection === "invoices" && <FileText className="w-16 h-16 text-muted-foreground mb-4" />}
              {activeSection === "settings" && <Settings className="w-16 h-16 text-muted-foreground mb-4" />}
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2 capitalize">
                {activeSection}
              </h2>
              <p className="text-muted-foreground text-center max-w-md">
                This section is coming soon. Manage your {activeSection} with AI-powered tools.
              </p>
            </motion.div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
        <div className="flex justify-around py-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
                  isActive ? "text-secondary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MerchantPage;
