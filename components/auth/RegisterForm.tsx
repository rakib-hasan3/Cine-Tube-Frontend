"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

export default function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axiosInstance.post("/auth/register", formData);
            if (res.status === 201 || res.status === 200) {
                toast.success("Account created successfully! Please login.");
                router.push("/login");
            }
        } catch (err: any) {
            console.error("Registration Error:", err);
            toast.error(err.response?.data?.message || "Registration failed. Please check your details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        toast.info("Google Signup is currently being integrated. Please use your email.");
    };

    return (
        <div className="space-y-6 ">
            <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-11 pr-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-11 pr-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full pl-11 pr-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300"
                        />
                    </div>
                </div>

                <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
            </form>

            <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
                    <span className="bg-[#0d0d0d] px-3 text-gray-600">Or continue with</span>
                </div>
            </div>

            <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-widest"
            >
                <FaGoogle className="w-4 h-4 text-rose-500" />
                Google
            </button>
        </div>
    );
}