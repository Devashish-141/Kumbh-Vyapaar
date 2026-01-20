import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface AuthDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type AuthMode = "login" | "signup" | "forgot";

export const AuthDialog = ({ isOpen, onClose, onSuccess }: AuthDialogProps) => {
    const { selectedLanguage } = useLanguage();
    const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

    const [mode, setMode] = useState<AuthMode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            if (data.user) {
                setSuccess(t.loginSuccess || "Login successful!");
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1000);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                setSuccess(t.signupSuccess || "Account created! Please check your email to verify.");
                setTimeout(() => {
                    setMode("login");
                    setSuccess("");
                }, 3000);
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError(err instanceof Error ? err.message : 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            setSuccess(t.resetEmailSent || "Password reset email sent! Please check your inbox.");
            setTimeout(() => {
                setMode("login");
                setSuccess("");
            }, 3000);
        } catch (err) {
            console.error('Password reset error:', err);
            setError(err instanceof Error ? err.message : 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setName("");
        setError("");
        setSuccess("");
        setShowPassword(false);
    };

    const handleClose = () => {
        resetForm();
        setMode("login");
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
                    className="relative w-full max-w-md bg-card rounded-2xl shadow-elevated border border-border overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border gradient-saffron">
                        <h2 className="font-display text-2xl font-bold text-primary-foreground">
                            {mode === "login" && (t.login || "Login")}
                            {mode === "signup" && (t.createAccount || "Create Account")}
                            {mode === "forgot" && (t.forgotPassword || "Forgot Password")}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors text-primary-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        {mode === "login" && (
                            <form onSubmit={handleLogin} className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t.email || "Email"}
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                            placeholder={t.emailPlaceholder || "your@email.com"}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t.password || "Password"}
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot Password Link */}
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => setMode("forgot")}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {t.forgotPassword || "Forgot Password?"}
                                    </button>
                                </div>

                                {/* Error/Success Messages */}
                                {error && (
                                    <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
                                        {success}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full gradient-saffron text-primary-foreground"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t.loggingIn || "Logging in..."}
                                        </>
                                    ) : (
                                        t.login || "Login"
                                    )}
                                </Button>

                                {/* Switch to Signup */}
                                <p className="text-center text-sm text-muted-foreground">
                                    {t.dontHaveAccount || "Don't have an account?"}{" "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("signup");
                                            resetForm();
                                        }}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        {t.signUp || "Sign Up"}
                                    </button>
                                </p>
                            </form>
                        )}

                        {mode === "signup" && (
                            <form onSubmit={handleSignup} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t.fullName || "Full Name"}
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                            placeholder={t.namePlaceholder || "Your name"}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t.email || "Email"}
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                            placeholder={t.emailPlaceholder || "your@email.com"}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t.password || "Password"}
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {t.passwordHint || "Minimum 6 characters"}
                                    </p>
                                </div>

                                {/* Error/Success Messages */}
                                {error && (
                                    <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
                                        {success}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full gradient-saffron text-primary-foreground"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t.creatingAccount || "Creating account..."}
                                        </>
                                    ) : (
                                        t.createAccount || "Create Account"
                                    )}
                                </Button>

                                {/* Switch to Login */}
                                <p className="text-center text-sm text-muted-foreground">
                                    {t.alreadyHaveAccount || "Already have an account?"}{" "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("login");
                                            resetForm();
                                        }}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        {t.login || "Login"}
                                    </button>
                                </p>
                            </form>
                        )}

                        {mode === "forgot" && (
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <p className="text-sm text-muted-foreground mb-4">
                                    {t.forgotPasswordDesc || "Enter your email address and we'll send you a link to reset your password."}
                                </p>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t.email || "Email"}
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                            placeholder={t.emailPlaceholder || "your@email.com"}
                                        />
                                    </div>
                                </div>

                                {/* Error/Success Messages */}
                                {error && (
                                    <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
                                        {success}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full gradient-saffron text-primary-foreground"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t.sending || "Sending..."}
                                        </>
                                    ) : (
                                        t.sendResetLink || "Send Reset Link"
                                    )}
                                </Button>

                                {/* Back to Login */}
                                <p className="text-center text-sm text-muted-foreground">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("login");
                                            resetForm();
                                        }}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        {t.backToLogin || "Back to Login"}
                                    </button>
                                </p>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
