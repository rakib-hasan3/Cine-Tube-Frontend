"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import Cookies from "js-cookie";
import { Mail, Lock, Loader2, Info, User, ShieldCheck } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useAuth();

    const performLogin = async (loginData: { email: string; password: string }) => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.post("/auth/login", loginData);
            const { success, data } = res.data;

            if (success && data?.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
                Cookies.set("accessToken", data.accessToken, { expires: 7, path: '/' });

                if (data.refreshToken) {
                    Cookies.set("refreshToken", data.refreshToken, { expires: 30, path: '/' });
                }

                setUser(data.user);
                toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);

                if (data.user.role === "ADMIN") {
                    router.push("/admin-dashboard");
                } else {
                    router.push("/");
                }
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            toast.error(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        performLogin({ email, password });
    };

    const handleQuickLogin = (role: 'ADMIN' | 'USER') => {
        const creds = role === 'ADMIN'
            ? { email: "admin@gmail.com", password: "password123" }
            : { email: "user@gmail.com", password: "user@gmail.com" };

        setEmail(creds.email);
        setPassword(creds.password);
        performLogin(creds);
    };

    const handleGoogleLogin = () => {
        toast.info("Google Login is currently being integrated. Please use your email.");
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full pl-11 pr-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Password</label>
                        <button type="button" className="text-[9px] font-bold text-indigo-500 hover:text-indigo-400">Forgot?</button>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                        />
                    </div>
                </div>

                <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                </button>
            </form>

            <div className="relative py-">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
                    <span className="bg-[#0d0d0d] px-3 text-gray-600">Or continue with</span>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-widest"
                >
                    <FaGoogle className="w-4 h-4 text-rose-500" />
                    Google
                </button>
            </div>

            {/* Quick Login Section */}
            <div className="pt-0">
                <div className="relative mb-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
                        <span className="bg-[#0d0d0d] px-3 text-indigo-500/80">Quick Access</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handleQuickLogin('USER')}
                        disabled={isLoading}
                        type="button"
                        className="group relative flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10 hover:border-indigo-500/30 active:scale-[0.98] disabled:opacity-50"
                    >
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">Demo</span>
                    </button>

                    <button
                        onClick={() => handleQuickLogin('ADMIN')}
                        disabled={isLoading}
                        type="button"
                        className="group relative flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10 hover:border-purple-500/30 active:scale-[0.98] disabled:opacity-50"
                    >
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">Admin</span>
                    </button>
                </div>
            </div>
        </div>
    );
}