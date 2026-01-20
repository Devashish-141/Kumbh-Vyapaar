import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Store, MapPin, Phone, Mail, Clock, Loader2, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface StoreSetupDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onStoreCreated: () => void;
    existingStore?: Store | null;
}

interface Store {
    id?: string;
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

export const StoreSetupDialog = ({ isOpen, onClose, onStoreCreated, existingStore }: StoreSetupDialogProps) => {
    const { selectedLanguage } = useLanguage();
    const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<Store>({
        store_name: "",
        description: "",
        category: "",
        address: "",
        latitude: undefined,
        longitude: undefined,
        landmark: "",
        phone: "",
        email: "",
        store_image_url: "",
        opening_hours: "9:00 AM - 9:00 PM",
        is_open: true,
    });

    useEffect(() => {
        if (existingStore) {
            setFormData({
                store_name: existingStore.store_name || "",
                description: existingStore.description || "",
                category: existingStore.category || "",
                address: existingStore.address || "",
                latitude: existingStore.latitude,
                longitude: existingStore.longitude,
                landmark: existingStore.landmark || "",
                phone: existingStore.phone || "",
                email: existingStore.email || "",
                store_image_url: existingStore.store_image_url || "",
                opening_hours: existingStore.opening_hours || "9:00 AM - 9:00 PM",
                is_open: existingStore.is_open ?? true,
            });
        }
    }, [existingStore]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError("You must be logged in to create a store");
                setIsSubmitting(false);
                return;
            }

            const storeData = {
                store_name: formData.store_name,
                description: formData.description,
                category: formData.category,
                address: formData.address,
                latitude: formData.latitude || null,
                longitude: formData.longitude || null,
                landmark: formData.landmark,
                phone: formData.phone,
                email: formData.email,
                store_image_url: formData.store_image_url || '🏪',
                opening_hours: formData.opening_hours,
                is_open: formData.is_open,
                user_id: user.id,
                is_active: true,
            };

            if (existingStore?.id) {
                // Update existing store
                const { error: updateError } = await supabase
                    .from('stores')
                    .update(storeData)
                    .eq('id', existingStore.id);

                if (updateError) throw updateError;
            } else {
                // Create new store
                const { error: insertError } = await supabase
                    .from('stores')
                    .insert([storeData]);

                if (insertError) throw insertError;
            }

            setSuccess(true);
            setTimeout(() => {
                onStoreCreated();
                onClose();
                resetForm();
            }, 1500);
        } catch (err) {
            console.error('Error saving store:', err);
            setError(err instanceof Error ? err.message : 'Failed to save store');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            store_name: "",
            description: "",
            category: "",
            address: "",
            latitude: undefined,
            longitude: undefined,
            landmark: "",
            phone: "",
            email: "",
            store_image_url: "",
            opening_hours: "9:00 AM - 9:00 PM",
            is_open: true,
        });
        setError("");
        setSuccess(false);
    };

    const handleClose = () => {
        if (!existingStore) {
            resetForm();
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Dialog */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-3xl bg-card rounded-2xl shadow-elevated border border-border overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border gradient-teal">
                        <div className="flex items-center gap-3">
                            <Store className="w-6 h-6 text-secondary-foreground" />
                            <h2 className="font-display text-2xl font-bold text-secondary-foreground">
                                {existingStore ? "Edit Store Profile" : "Setup Your Store"}
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-secondary-foreground/10 transition-colors text-secondary-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        {/* Store Name */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Store Name <span className="text-danger">*</span>
                            </label>
                            <div className="relative">
                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    name="store_name"
                                    value={formData.store_name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                    placeholder="e.g., Tibetan Market Store"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Category <span className="text-danger">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                            >
                                <option value="">Select category</option>
                                <option value="Clothing">Clothing & Textiles</option>
                                <option value="Jewelry">Jewelry & Accessories</option>
                                <option value="Food">Food & Beverages</option>
                                <option value="Religious Items">Religious Items</option>
                                <option value="Handicrafts">Handicrafts & Art</option>
                                <option value="Home Decor">Home Decor</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all resize-none"
                                placeholder="Tell pilgrims about your store..."
                            />
                        </div>

                        {/* Store Image */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Store Image
                            </label>
                            <ImageUpload
                                currentImage={formData.store_image_url}
                                onImageUploaded={(url) => setFormData(prev => ({ ...prev, store_image_url: url }))}
                                bucket="store-images"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Full Address <span className="text-danger">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    rows={2}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all resize-none"
                                    placeholder="Enter your complete store address"
                                />
                            </div>
                        </div>

                        {/* Landmark */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Nearby Landmark
                            </label>
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                placeholder="e.g., Near Ramkund, Panchavati"
                            />
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Phone Number <span className="text-danger">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                        placeholder="store@email.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Opening Hours */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Opening Hours
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    name="opening_hours"
                                    value={formData.opening_hours}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                    placeholder="e.g., 9:00 AM - 9:00 PM"
                                />
                            </div>
                        </div>

                        {/* Store Status */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="is_open"
                                id="is_open"
                                checked={formData.is_open}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded border-border text-secondary focus:ring-2 focus:ring-secondary"
                            />
                            <label htmlFor="is_open" className="text-sm font-medium text-foreground cursor-pointer">
                                Store is currently open
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Store {existingStore ? "updated" : "created"} successfully!
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 gradient-teal text-secondary-foreground"
                                disabled={isSubmitting || success}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    existingStore ? "Update Store" : "Create Store"
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
