import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Link } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    onImageUploaded: (url: string) => void;
    currentImage?: string;
    bucket?: string;
}

export const ImageUpload = ({
    onImageUploaded,
    currentImage,
    bucket = "product-images"
}: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [error, setError] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
        }

        setError("");
        setIsUploading(true);

        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // If not logged in, just use the local preview
                const reader2 = new FileReader();
                reader2.onloadend = () => {
                    const result = reader2.result as string;
                    setPreview(result);
                    onImageUploaded(result);
                };
                reader2.readAsDataURL(file);
                setIsUploading(false);
                return;
            }

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            // Try to upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                // If bucket doesn't exist, fall back to base64
                console.warn('Storage upload failed, using base64:', uploadError);
                const reader2 = new FileReader();
                reader2.onloadend = () => {
                    const result = reader2.result as string;
                    setPreview(result);
                    onImageUploaded(result);
                };
                reader2.readAsDataURL(file);
                setError("Storage not configured. Using local image (will work for now).");
                setIsUploading(false);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(data.path);

            onImageUploaded(publicUrl);
        } catch (err) {
            console.error('Upload error:', err);
            // Fall back to base64 on any error
            const file2 = fileInputRef.current?.files?.[0];
            if (file2) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    setPreview(result);
                    onImageUploaded(result);
                };
                reader.readAsDataURL(file2);
                setError("Using local image. Upload to storage failed.");
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            setPreview(urlInput);
            onImageUploaded(urlInput);
            setShowUrlInput(false);
            setUrlInput("");
            setError("");
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageUploaded("");
        setUrlInput("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
            />

            {preview ? (
                <div className="relative group">
                    <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-border bg-muted">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 rounded-full bg-danger text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
            ) : showUrlInput ? (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/image.jpg or 🎁"
                            className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        />
                        <Button type="button" onClick={handleUrlSubmit} size="sm">
                            Add
                        </Button>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUrlInput(false)}
                        className="w-full"
                    >
                        Cancel
                    </Button>
                </div>
            ) : (
                <div className="space-y-2">
                    <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-all"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isUploading ? (
                                <Loader2 className="w-12 h-12 text-muted-foreground animate-spin mb-3" />
                            ) : (
                                <>
                                    <ImageIcon className="w-12 h-12 text-muted-foreground mb-3" />
                                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                </>
                            )}
                            <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                                PNG, JPG, GIF up to 5MB
                            </p>
                        </div>
                    </label>

                    <div className="text-center">
                        <span className="text-xs text-muted-foreground">or</span>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowUrlInput(true)}
                        className="w-full gap-2"
                    >
                        <Link className="w-4 h-4" />
                        Use Image URL or Emoji
                    </Button>
                </div>
            )}

            {error && (
                <p className="text-sm text-orange-500">{error}</p>
            )}
        </div>
    );
};
