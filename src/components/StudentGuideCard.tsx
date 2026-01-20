import { motion } from "framer-motion";
import { User, Languages, BookOpen, GraduationCap, Phone, MessageSquare, ShieldCheck, Clock, IndianRupee } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface StudentGuideProps {
    name: string;
    college: string;
    age: number;
    languages: string[];
    specialization: string;
    dailyRate: string;
    studentId: string;
    image?: string;
    verified?: boolean;
    phone?: string;
    t: any;
}

export function StudentGuideCard({
    name,
    college,
    age,
    languages,
    specialization,
    dailyRate,
    studentId,
    image,
    verified = true,
    phone = "9876543210",
    t
}: StudentGuideProps) {
    const navigate = useNavigate();

    const handleCall = (phoneNumber: string) => {
        window.location.href = `tel:${phoneNumber}`;
    };

    const handleWhatsApp = (phoneNumber: string) => {
        const message = encodeURIComponent(`Hi ${name}, I'm interested in booking you as a student guide for Nashik exploring ${specialization}.`);
        window.open(`https://wa.me/91${phoneNumber}?text=${message}`, '_blank');
    };

    const handleBookNow = () => {
        navigate('/checkout', {
            state: {
                cart: [{
                    id: studentId,
                    name: `Guide: ${name}`,
                    price: parseFloat(dailyRate),
                    quantity: 1,
                    image_url: "🎓"
                }],
                storeName: "Student Guide Services",
                storeId: "guides"
            }
        });
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft hover:shadow-elevated transition-all flex flex-col h-full"
        >
            <div className="relative h-48 bg-muted">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-saffron/10 to-orange/10">
                        <User className="w-16 h-16 text-saffron/40" />
                    </div>
                )}
                {verified && (
                    <div className="absolute top-4 right-4 bg-success/90 backdrop-blur-md text-success-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-success/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {t.verified}
                    </div>
                )}
                <div className="absolute bottom-4 left-4">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                        ID: {studentId}
                    </div>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <GraduationCap className="w-4 h-4 text-saffron" />
                        <span>{college} • {age} {t.age}</span>
                    </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-start gap-3">
                        <Languages className="w-4 h-4 text-saffron mt-1 shrink-0" />
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-0.5">{t.languages}</p>
                            <p className="text-sm text-foreground font-medium">{languages.join(", ")}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <BookOpen className="w-4 h-4 text-saffron mt-1 shrink-0" />
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-0.5">{t.specialization}</p>
                            <p className="text-sm text-foreground font-medium leading-relaxed">{specialization}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-border mt-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{t.dailyRate}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-foreground">₹{dailyRate}</span>
                                <span className="text-xs text-muted-foreground">/day</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleCall(studentId.includes('42') ? "9876543210" : "9123456789")}
                                size="icon" variant="outline" className="rounded-full w-10 h-10 border-saffron/20 hover:bg-saffron/5 text-saffron"
                            >
                                <Phone className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => handleWhatsApp(studentId.includes('42') ? "9876543210" : "9123456789")}
                                size="icon" variant="outline" className="rounded-full w-10 h-10 border-green-500/20 hover:bg-green-500/5 text-green-600"
                            >
                                <MessageSquare className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <Button
                        onClick={handleBookNow}
                        className="w-full gradient-saffron text-white shadow-glow-saffron hover:opacity-90 font-bold tracking-wide"
                    >
                        {t.bookNow}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
