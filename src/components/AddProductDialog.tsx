import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { ImageUpload } from "@/components/ImageUpload";

interface AddProductDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onProductAdded: () => void;
}

export const AddProductDialog = ({ isOpen, onClose, onProductAdded }: AddProductDialogProps) => {
    const { selectedLanguage } = useLanguage();
    const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

    const [formData, setFormData] = useState({
        serialNo: "",
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        imageUrl: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError("You must be logged in to add products");
                setIsSubmitting(false);
                return;
            }

            // Fetch the merchant's store to get store_id
            const { data: storeData, error: storeError } = await supabase
                .from('stores')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (storeError || !storeData) {
                setError("Please create your store profile first in Settings");
                setIsSubmitting(false);
                return;
            }

            const { error: insertError } = await supabase
                .from('products')
                .insert([
                    {
                        name: formData.name,
                        description: formData.description,
                        price: parseFloat(formData.price),
                        stock: parseInt(formData.stock) || 0,
                        sold: 0,
                        image_url: formData.imageUrl || '📦',
                        category: formData.category,
                        user_id: user.id,
                        store_id: storeData.id, // Link to store
                        is_active: true,
                    }
                ]);

            if (insertError) throw insertError;

            setSuccess(true);
            setTimeout(() => {
                onProductAdded();
                onClose();
                resetForm();
            }, 1500);
        } catch (err) {
            console.error('Error adding product:', err);
            setError(err instanceof Error ? err.message : 'Failed to add product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            serialNo: "",
            name: "",
            price: "",
            description: "",
            stock: "",
            category: "",
            imageUrl: "",
        });
        setError("");
        setSuccess(false);
    };

    const handleClose = () => {
        resetForm();
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
                    className="relative w-full max-w-2xl bg-card rounded-2xl shadow-elevated border border-border overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border gradient-teal">
                        <h2 className="font-display text-2xl font-bold text-secondary-foreground">
                            {t.addNewProduct || "Add New Product"}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-secondary-foreground/10 transition-colors text-secondary-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {/* Serial Number */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                {t.serialNumber || "Serial Number"} <span className="text-muted-foreground">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="serialNo"
                                value={formData.serialNo}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                placeholder="e.g., SKU-001"
                            />
                        </div>

                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                {t.productName || "Product Name"} <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                placeholder={t.productNamePlaceholder || "Enter product name"}
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                {t.price || "Price"} (₹) <span className="text-danger">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                {t.stock || "Stock Quantity"}
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                placeholder="0"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                {t.category || "Category"}
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                placeholder={t.categoryPlaceholder || "e.g., Clothing, Jewelry, Food"}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                {t.description || "Description"}
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all resize-none"
                                placeholder={t.descriptionPlaceholder || "Describe your product..."}
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                {t.imageUrl || "Product Image"}
                            </label>
                            <ImageUpload
                                currentImage={formData.imageUrl}
                                onImageUploaded={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            />
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
                                {t.productAdded || "Product added successfully!"}
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
                                {t.cancel || "Cancel"}
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 gradient-teal text-secondary-foreground"
                                disabled={isSubmitting || success}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {t.adding || "Adding..."}
                                    </>
                                ) : (
                                    t.addProduct || "Add Product"
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
