"use client";
import Link from "next/link";
import { useState } from "react";
import { BsInstagram, BsTwitter, BsYoutube, BsGithub } from "react-icons/bs";
import { FaFacebook, FaLinkedinIn } from "react-icons/fa";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const response = await axiosInstance.post("/newsletter/subscribe", { email });
            if (response.data.success) {
                setIsSubscribed(true);
                setEmail("");
                toast.success("Welcome to the club! Check your email.");
            }
        } catch (error: any) {
            console.error("Newsletter error:", error);
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const noFooterRoutes = [
        "/admin-dashboard", 
        "/media-management", 
        "/user-management", 
        "/review-moderation", 
        "/admin-settings"
    ];

    const isMediaDetailPage = pathname?.startsWith("/media/") && pathname !== "/media";
    const isWatchPage = pathname?.startsWith("/watch/");

    if (noFooterRoutes.some(route => pathname?.startsWith(route)) || isMediaDetailPage || isWatchPage) {
        return null;
    }

    return (
        <footer className="bg-[#0a0a0a] border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Brand & Social Section */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform duration-300">
                                CT
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                Cine<span className="text-indigo-500">Tube</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
                            Premium streaming experience for movie lovers worldwide. Discover, watch, and enjoy high-quality content on any device.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: FaFacebook, href: "#" },
                                { icon: BsTwitter, href: "#" },
                                { icon: BsInstagram, href: "#" },
                                { icon: BsYoutube, href: "#" }
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300"
                                >
                                    <social.icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links - Platform */}
                    <div className="flex flex-col items-start">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 text-left">Platform</h4>
                        <ul className="space-y-4 flex flex-col items-start">
                            {[
                                { name: "Browse Media", href: "/media" },
                                { name: "Pricing Plans", href: "/pricing" },
                                { name: "Watchlist", href: "/watchlist" },
                                { name: "Trending", href: "/media" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-sm font-bold text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-all" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div className="flex flex-col items-start">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 text-left">Support</h4>
                        <ul className="space-y-4 flex flex-col items-start">
                            {[
                                { name: "Help Center", href: "/#FAQ" },
                                { name: "Contact Support", href: "/#contact" },
                                { name: "Privacy Policy", href: "/" },
                                { name: "Terms of Use", href: "/" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-sm font-bold text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-all" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter - Premium Design */}
                    <div className="flex flex-col items-start">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 text-left">Stay Updated</h4>
                        <p className="text-sm text-gray-400 mb-6 font-medium text-left">Subscribe to get latest news and trailer updates.</p>

                        {!isSubscribed ? (
                            <form onSubmit={handleSubscribe} className="relative group w-full max-w-xs">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                />
                                <button
                                    disabled={isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        ) : (
                            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 animate-in fade-in zoom-in duration-300">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-bold">Successfully Subscribed!</span>
                            </div>
                        )}
                        <p className="text-[10px] text-gray-600 mt-4 italic">
                            *By subscribing, you agree to our privacy policy.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                            © {currentYear} CineTube. All Rights Reserved.
                        </p>
                        <div className="h-4 w-px bg-white/10 hidden md:block" />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                            Handcrafted by <span className="text-indigo-500">Rakib Hasan</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                        <Link href="#" className="hover:text-white transition-colors">Server Status</Link>
                        <Link href="#" className="hover:text-white transition-colors">GDPR</Link>
                        <Link href="#" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}