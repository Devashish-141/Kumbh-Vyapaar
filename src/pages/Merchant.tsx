import { useState, useEffect } from "react";
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
  Loader2,
  Receipt,
  Store,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import { AddProductDialog } from "@/components/AddProductDialog";
import { VoiceProductDialog } from "@/components/VoiceProductDialog";
import { InvoiceDialog } from "@/components/InvoiceDialog";
import { StoreSetupDialog } from "@/components/StoreSetupDialog";

interface Product {
  id: string;
  name: string;
  price: number;
  sold: number;
  stock: number;
  image_url: string;
  category?: string;
}

interface Store {
  id: string;
  store_name: string;
  description: string;
  category: string;
  address: string;
  latitude?: number;
  longitude?: number;
  landmark: string;
  phone: string;
  email: string;
  store_image_url: string;
  opening_hours: string;
  is_open: boolean;
}

const MerchantPage = () => {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState<"dashboard" | "products" | "invoices" | "settings">("dashboard");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isStoreSetupOpen, setIsStoreSetupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const navigate = useNavigate();
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  useEffect(() => {
    fetchProducts();
    fetchStore();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStore = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoadingStore(false);
        return;
      }

      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setStore(data);
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    } finally {
      setIsLoadingStore(false);
    }
  };

  // Calculate stats from real data
  const totalSales = products.reduce((acc, curr) => acc + (curr.price * curr.sold), 0);
  const totalOrders = products.reduce((acc, curr) => acc + curr.sold, 0);

  const stats = [
    { label: t.todaysSales, value: `₹${totalSales.toLocaleString()}`, icon: IndianRupee, change: "+12%" },
    { label: t.totalOrders, value: totalOrders.toString(), icon: Package, change: "+8%" },
    { label: t.newCustomers, value: "12", icon: Users, change: "+25%" },
    { label: t.conversionRate, value: "3.2%", icon: TrendingUp, change: "+5%" },
  ];

  const menuItems = [
    { id: "dashboard" as const, label: t.dashboard, icon: BarChart3 },
    { id: "products" as const, label: t.products, icon: Package },
    { id: "invoices" as const, label: t.invoices, icon: FileText },
    { id: "settings" as const, label: t.settings, icon: Settings },
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
            <span className="text-sm">{t.backToHome}</span>
          </motion.button>

          <div className="mb-8">
            <h2 className="font-display text-xl font-bold text-foreground">{t.merchantHub}</h2>
            <p className="text-sm text-muted-foreground">{t.manageYourBusiness}</p>
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
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${isActive
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
              <span className="text-sm">{t.back}</span>
            </button>
            <h1 className="font-display text-2xl font-bold text-foreground">{t.merchantHub}</h1>
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
                      {t.aiProductAssistant}
                    </h3>
                    <p className="text-secondary-foreground/80 text-sm mb-4">
                      {t.aiAssistantDesc}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsVoiceDialogOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-secondary-foreground text-secondary hover:opacity-90"
                    >
                      <Mic className="w-4 h-4" />
                      {t.startSpeaking}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Recent Products */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    {t.yourProducts}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsAddProductOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    {t.addNew}
                  </Button>
                </div>

                <div className="grid gap-4">
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                      <p>No products found. Add your first product!</p>
                    </div>
                  ) : (
                    products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-soft hover:shadow-elevated transition-shadow"
                      >
                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-2xl overflow-hidden">
                          {product.image_url && product.image_url.startsWith('http') ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{product.image_url || '📦'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                          {/* Showing category as subtitle if available, otherwise simplified */}
                          {product.category && (
                            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">₹{product.price}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.sold} {t.sold} • {product.stock} {t.inStock}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Section */}
          {activeSection === "products" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  All Products
                </h2>
                <Button
                  onClick={() => setIsAddProductOpen(true)}
                  className="gradient-teal text-secondary-foreground gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Product
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center p-12 bg-card rounded-xl border border-border">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No products yet. Start adding your first product!</p>
                  <Button onClick={() => setIsAddProductOpen(true)} className="gradient-teal">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card rounded-xl border border-border p-4 shadow-soft hover:shadow-elevated transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-3xl overflow-hidden flex-shrink-0">
                          {product.image_url && product.image_url.startsWith('http') ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{product.image_url || '📦'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate mb-1">{product.name}</h3>
                          {product.category && (
                            <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                          )}
                          <p className="text-lg font-bold text-primary mt-2">₹{product.price.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">Stock</p>
                          <p className="font-semibold text-foreground">{product.stock}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sold</p>
                          <p className="font-semibold text-success">{product.sold}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-semibold text-foreground">₹{(product.price * product.sold).toLocaleString()}</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsInvoiceDialogOpen(true);
                        }}
                        className="w-full gradient-saffron text-primary-foreground gap-2"
                        size="sm"
                      >
                        <Receipt className="w-4 h-4" />
                        Generate Invoice
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Invoices Section */}
          {activeSection === "invoices" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Invoice Generator
              </h2>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="text-center mb-6">
                  <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Generate Professional Invoices</h3>
                  <p className="text-muted-foreground text-sm">
                    Select a product from the Products section to generate a PDF invoice with customer details
                  </p>
                </div>

                {products.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Quick Access - Recent Products:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {products.slice(0, 4).map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsInvoiceDialogOpen(true);
                          }}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all text-left"
                        >
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl overflow-hidden flex-shrink-0">
                            {product.image_url && product.image_url.startsWith('http') ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{product.image_url || '📦'}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground">₹{product.price.toLocaleString()}</p>
                          </div>
                          <Receipt className="w-5 h-5 text-primary flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                    <Button
                      onClick={() => setActiveSection("products")}
                      variant="outline"
                      className="w-full"
                    >
                      View All Products
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No products available. Add products first to generate invoices.</p>
                    <Button onClick={() => setActiveSection("products")} className="gradient-teal">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Products
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Settings Section - Store Setup */}
          {activeSection === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Store Settings
              </h2>

              {isLoadingStore ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : store ? (
                <div className="space-y-6">
                  {/* Store Profile Card */}
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center text-4xl overflow-hidden flex-shrink-0">
                        {store.store_image_url && store.store_image_url.startsWith('http') ? (
                          <img src={store.store_image_url} alt={store.store_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl">{store.store_image_url || '🏪'}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-2">{store.store_name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 capitalize">{store.category}</p>
                        {store.description && (
                          <p className="text-foreground mb-3">{store.description}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${store.is_open ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {store.is_open ? '● Open' : '● Closed'}
                          </span>
                          {store.opening_hours && (
                            <span className="text-sm text-muted-foreground">
                              {store.opening_hours}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsStoreSetupOpen(true)}
                        variant="outline"
                        className="gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Edit Store
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Address</p>
                        <p className="text-foreground">{store.address}</p>
                        {store.landmark && (
                          <p className="text-sm text-muted-foreground mt-1">Near {store.landmark}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Contact</p>
                        <p className="text-foreground">{store.phone}</p>
                        {store.email && (
                          <p className="text-sm text-muted-foreground">{store.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Marketplace Visibility Info */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">Your Store is Live!</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Pilgrims can now discover your store in the Marketplace section. They can view your products and get directions to reach your location.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full bg-background text-xs font-medium text-foreground">
                            📍 Visible in Marketplace
                          </span>
                          <span className="px-3 py-1 rounded-full bg-background text-xs font-medium text-foreground">
                            🗺️ Directions Available
                          </span>
                          <span className="px-3 py-1 rounded-full bg-background text-xs font-medium text-foreground">
                            📦 {products.length} Products Listed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Setup Your Store Profile</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Create your store profile to appear in the Marketplace. Pilgrims will be able to discover your products and get directions to your location.
                  </p>
                  <Button
                    onClick={() => setIsStoreSetupOpen(true)}
                    className="gradient-teal text-secondary-foreground gap-2"
                  >
                    <Store className="w-4 h-4" />
                    Create Store Profile
                  </Button>
                </div>
              )}
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
                className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${isActive ? "text-secondary" : "text-muted-foreground"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Dialogs */}
      <AddProductDialog
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductAdded={fetchProducts}
      />

      <VoiceProductDialog
        isOpen={isVoiceDialogOpen}
        onClose={() => setIsVoiceDialogOpen(false)}
        onProductAdded={fetchProducts}
      />

      {selectedProduct && (
        <InvoiceDialog
          isOpen={isInvoiceDialogOpen}
          onClose={() => {
            setIsInvoiceDialogOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}

      <StoreSetupDialog
        isOpen={isStoreSetupOpen}
        onClose={() => setIsStoreSetupOpen(false)}
        onStoreCreated={fetchStore}
        existingStore={store}
      />
    </div>
  );
};

export default MerchantPage;
