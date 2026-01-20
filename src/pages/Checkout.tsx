import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    ShoppingCart,
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Check,
    Loader2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
}

interface CheckoutState {
    cart: CartItem[];
    storeName: string;
    storeId: string;
}

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedLanguage } = useLanguage();
    const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

    const state = location.state as CheckoutState;
    const cart = state?.cart || [];
    const storeName = state?.storeName || "Store";
    const storeId = state?.storeId || "";

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        paymentMethod: "cod", // cod, upi, card
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 500 ? 0 : 50;
    const total = subtotal + deliveryFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) newErrors.phone = "Invalid phone number";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setOrderComplete(true);

            // Redirect to success page after 3 seconds
            setTimeout(() => {
                navigate('/visitor');
            }, 3000);
        }, 2000);
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
                    <Button onClick={() => navigate('/visitor')} className="mt-4">
                        Continue Shopping
                    </Button>
                </div>
            </div>
        );
    }

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center max-w-md mx-auto p-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6"
                    >
                        <Check className="w-10 h-10 text-success" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Order Placed!</h2>
                    <p className="text-muted-foreground mb-4">
                        Thank you for your order. You will receive a confirmation shortly.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Redirecting to marketplace...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-8">
            <Header selectedLanguage={selectedLanguage} onLanguageChange={() => { }} variant="solid" />

            <div className="pt-24 pb-8">
                <div className="container mx-auto px-4">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back</span>
                    </motion.button>

                    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                        Checkout
                    </h1>
                    <p className="text-muted-foreground mb-8">Complete your order from {storeName}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card rounded-xl border border-border p-6"
                            >
                                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Full Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.fullName ? 'border-danger' : 'border-border'
                                                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
                                            placeholder="John Doe"
                                        />
                                        {errors.fullName && (
                                            <p className="text-danger text-sm mt-1">{errors.fullName}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Email <span className="text-danger">*</span>
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.email ? 'border-danger' : 'border-border'
                                                        } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-danger text-sm mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Phone <span className="text-danger">*</span>
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.phone ? 'border-danger' : 'border-border'
                                                        } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
                                                    placeholder="9876543210"
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="text-danger text-sm mt-1">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Delivery Address */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-card rounded-xl border border-border p-6"
                            >
                                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Delivery Address
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Address <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.address ? 'border-danger' : 'border-border'
                                                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none`}
                                            placeholder="House no., Street, Area"
                                        />
                                        {errors.address && (
                                            <p className="text-danger text-sm mt-1">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                City <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.city ? 'border-danger' : 'border-border'
                                                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
                                                placeholder="Nashik"
                                            />
                                            {errors.city && (
                                                <p className="text-danger text-sm mt-1">{errors.city}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                State <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.state ? 'border-danger' : 'border-border'
                                                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
                                                placeholder="Maharashtra"
                                            />
                                            {errors.state && (
                                                <p className="text-danger text-sm mt-1">{errors.state}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Pincode <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.pincode ? 'border-danger' : 'border-border'
                                                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
                                                placeholder="422001"
                                            />
                                            {errors.pincode && (
                                                <p className="text-danger text-sm mt-1">{errors.pincode}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Payment Method */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-card rounded-xl border border-border p-6"
                            >
                                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Payment Method
                                </h2>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === "cod"}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-primary"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">Cash on Delivery</p>
                                            <p className="text-sm text-muted-foreground">Pay when you receive</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="upi"
                                            checked={formData.paymentMethod === "upi"}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-primary"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">UPI Payment</p>
                                            <p className="text-sm text-muted-foreground">PhonePe, Google Pay, Paytm</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === "card"}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-primary"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">Credit/Debit Card</p>
                                            <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                                        </div>
                                    </label>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-card rounded-xl border border-border p-6 sticky top-24"
                            >
                                <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {item.image_url && item.image_url.startsWith('http') ? (
                                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl">{item.image_url || '📦'}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground truncate">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                <p className="text-sm font-semibold text-foreground">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-2 py-4 border-t border-border">
                                    <div className="flex justify-between text-foreground">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-foreground">
                                        <span>Delivery Fee</span>
                                        <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                                    </div>
                                    {deliveryFee === 0 && (
                                        <p className="text-xs text-success">Free delivery on orders above ₹500</p>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center py-4 border-t border-border">
                                    <span className="text-lg font-semibold text-foreground">Total</span>
                                    <span className="text-2xl font-bold text-primary">₹{total.toLocaleString()}</span>
                                </div>

                                {/* Place Order Button */}
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="w-full gradient-teal text-secondary-foreground gap-2 py-6 text-lg"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Place Order
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-muted-foreground text-center mt-4">
                                    By placing this order, you agree to our terms and conditions
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
