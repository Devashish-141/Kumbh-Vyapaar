import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Phone,
    Clock,
    Store as StoreIcon,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { supabase } from "@/lib/supabase";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    category: string;
}

interface Store {
    id: string;
    store_name: string;
    description: string;
    category: string;
    address: string;
    landmark: string;
    phone: string;
    email: string;
    store_image_url: string;
    opening_hours: string;
    is_open: boolean;
}

interface CartItem extends Product {
    quantity: number;
}

const StoreDetailPage = () => {
    const { storeId } = useParams<{ storeId: string }>();
    const navigate = useNavigate();
    const { selectedLanguage } = useLanguage();
    const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

    const [store, setStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (storeId) {
            fetchStoreAndProducts();
        }
    }, [storeId]);

    const fetchStoreAndProducts = async () => {
        setIsLoading(true);
        try {
            // Fetch store details
            const { data: storeData, error: storeError } = await supabase
                .from('stores')
                .select('*')
                .eq('id', storeId)
                .single();

            if (storeError) throw storeError;
            setStore(storeData);

            // Fetch products for this store
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .eq('store_id', storeId)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (productsError) throw productsError;
            setProducts(productsData || []);
        } catch (error) {
            console.error('Error fetching store data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, change: number) => {
        setCart((prevCart) =>
            prevCart
                .map((item) => {
                    if (item.id === productId) {
                        const newQuantity = item.quantity + change;
                        if (newQuantity <= 0) return null;
                        return { ...item, quantity: Math.min(newQuantity, item.stock) };
                    }
                    return item;
                })
                .filter((item): item is CartItem => item !== null)
        );
    };

    const removeFromCart = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const openDirections = () => {
        if (store) {
            const encodedLocation = encodeURIComponent(`${store.store_name}, ${store.address}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <StoreIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-foreground mb-2">Store Not Found</h2>
                    <Button onClick={() => navigate('/visitor')} className="mt-4">
                        Back to Marketplace
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            <Header selectedLanguage={selectedLanguage} onLanguageChange={() => { }} variant="solid" />

            {/* Store Header */}
            <div className="pt-24 pb-8 bg-gradient-sacred">
                <div className="container mx-auto px-4">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate('/visitor')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to Marketplace</span>
                    </motion.button>

                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Store Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-32 h-32 rounded-xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border-4 border-background shadow-lg"
                        >
                            {store.store_image_url && store.store_image_url.startsWith('http') ? (
                                <img src={store.store_image_url} alt={store.store_name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-6xl">{store.store_image_url || '🏪'}</span>
                            )}
                        </motion.div>

                        {/* Store Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex-1"
                        >
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                                {store.store_name}
                            </h1>
                            <p className="text-lg text-muted-foreground capitalize mb-3">{store.category}</p>
                            {store.description && (
                                <p className="text-foreground mb-4">{store.description}</p>
                            )}

                            <div className="flex flex-wrap gap-3">
                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${store.is_open ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                                    }`}>
                                    {store.is_open ? '● Open' : '● Closed'}
                                </span>
                                {store.opening_hours && (
                                    <span className="px-3 py-1.5 rounded-full bg-muted text-foreground text-sm flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {store.opening_hours}
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 space-y-2">
                                {store.phone && (
                                    <a href={`tel:${store.phone}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                                        <Phone className="w-4 h-4" />
                                        {store.phone}
                                    </a>
                                )}
                                <div className="flex items-start gap-2 text-foreground">
                                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                    <div>
                                        <p>{store.address}</p>
                                        {store.landmark && (
                                            <p className="text-sm text-muted-foreground">Near {store.landmark}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button onClick={openDirections} className="mt-4 gap-2">
                                <MapPin className="w-4 h-4" />
                                Get Directions
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <main className="container mx-auto px-4 py-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                    Available Products ({products.length})
                </h2>

                {products.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-xl border border-border">
                        <StoreIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No products available at the moment</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => {
                            const cartItem = cart.find((item) => item.id === product.id);
                            const inCart = !!cartItem;

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-card rounded-xl border border-border overflow-hidden shadow-soft hover:shadow-elevated transition-all"
                                >
                                    {/* Product Image */}
                                    <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                                        {product.image_url && product.image_url.startsWith('http') ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-6xl">{product.image_url || '📦'}</span>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-lg text-foreground mb-1">{product.name}</h3>
                                            {product.category && (
                                                <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                                            )}
                                        </div>

                                        {product.description && (
                                            <p className="text-sm text-foreground line-clamp-2">{product.description}</p>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-border">
                                            <div>
                                                <p className="text-2xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Add to Cart / Quantity Controls */}
                                        {product.stock > 0 && (
                                            <div className="pt-2">
                                                {!inCart ? (
                                                    <Button
                                                        onClick={() => addToCart(product)}
                                                        className="w-full gradient-teal text-secondary-foreground gap-2"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" />
                                                        Add to Cart
                                                    </Button>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            onClick={() => updateQuantity(product.id, -1)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="px-3"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                        <span className="flex-1 text-center font-semibold text-foreground">
                                                            {cartItem.quantity}
                                                        </span>
                                                        <Button
                                                            onClick={() => updateQuantity(product.id, 1)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="px-3"
                                                            disabled={cartItem.quantity >= product.stock}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() => removeFromCart(product.id)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="px-3 text-danger hover:bg-danger/10"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Floating Cart Summary */}
            {cart.length > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50"
                >
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">
                                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">in your cart</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Total Due</p>
                                    <p className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</p>
                                </div>
                                <Button
                                    onClick={() => navigate('/checkout', {
                                        state: {
                                            cart: cart,
                                            storeName: store?.store_name,
                                            storeId: store?.id
                                        }
                                    })}
                                    className="gradient-teal text-secondary-foreground gap-2 px-6 py-6"
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default StoreDetailPage;
