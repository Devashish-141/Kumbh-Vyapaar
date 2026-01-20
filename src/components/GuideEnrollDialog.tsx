import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, User, Phone, GraduationCap, Languages, BookOpen, IndianRupee, Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface GuideEnrollDialogProps {
    isOpen: boolean;
    onClose: () => void;
    t: any;
}

export function GuideEnrollDialog({ isOpen, onClose, t }: GuideEnrollDialogProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        college_name: "",
        age: "",
        student_id: "",
        daily_rate: "",
        languages_spoken: "",
        specialization: "",
        description: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('student_guides')
                .insert([
                    {
                        full_name: formData.full_name,
                        email: formData.email,
                        phone: formData.phone,
                        college_name: formData.college_name,
                        age: parseInt(formData.age),
                        student_id: formData.student_id,
                        daily_rate: parseFloat(formData.daily_rate),
                        languages_spoken: formData.languages_spoken.split(',').map(s => s.trim()),
                        specialization: [formData.specialization],
                        description: formData.description,
                        is_verified: true, // Auto-verify for demo purposes, usually would be false
                        is_available: true
                    }
                ]);

            if (error) throw error;

            setIsSuccess(true);
            toast({
                title: "Enrolled Successfully!",
                description: "Your guide profile has been created and verified.",
            });

            // Wait 2 seconds then close
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({
                    full_name: "",
                    email: "",
                    phone: "",
                    college_name: "",
                    age: "",
                    student_id: "",
                    daily_rate: "",
                    languages_spoken: "",
                    specialization: "",
                    description: ""
                });
            }, 2000);

        } catch (error: any) {
            console.error("Enrollment error:", error);
            toast({
                title: "Enrollment Failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold font-display flex items-center gap-2">
                        <GraduationCap className="text-saffron" />
                        Enroll as a Student Guide
                    </DialogTitle>
                    <DialogDescription>
                        Share your knowledge of Nashik with pilgrims and earn while you learn.
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-success" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Application Submitted!</h3>
                        <p className="text-muted-foreground">Your profile is now live. Redirecting...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        placeholder="John Doe"
                                        className="pl-9"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="pl-9"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="9876543210"
                                        className="pl-9"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="college_name">College Name</Label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="college_name"
                                        name="college_name"
                                        placeholder="KTHM College"
                                        className="pl-9"
                                        value={formData.college_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    name="age"
                                    type="number"
                                    placeholder="20"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    required
                                    min="18"
                                    max="30"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="student_id">Student ID / Roll No.</Label>
                                <Input
                                    id="student_id"
                                    name="student_id"
                                    placeholder="N-2024-XXX"
                                    value={formData.student_id}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="daily_rate">Daily Rate (₹)</Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="daily_rate"
                                        name="daily_rate"
                                        type="number"
                                        placeholder="500"
                                        className="pl-9"
                                        value={formData.daily_rate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="languages_spoken">Languages (Comma separated)</Label>
                                <div className="relative">
                                    <Languages className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="languages_spoken"
                                        name="languages_spoken"
                                        placeholder="English, Marathi, Hindi"
                                        className="pl-9"
                                        value={formData.languages_spoken}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialization">Your Expert Area</Label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="specialization"
                                    name="specialization"
                                    placeholder="e.g. Ancient Temple Architecture, Local Food Trails"
                                    className="pl-9"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Tell us more about yourself</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe your experience and why you'd be a great guide..."
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" className="gradient-saffron text-white min-w-[120px]" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Enroll Now"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
