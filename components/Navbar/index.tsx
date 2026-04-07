"use client";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { User, LogOut, ChevronDown, Bell, Menu, X, Crown } from "lucide-react"; // ✅ Crown আইকন যোগ করা হয়েছে
import { useState } from "react";
import axiosInstance from "@/lib/axios";

export default function Navbar() {
    const { user, setUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ✅ চেক করছি ইউজার প্রিমিয়াম কি না
    const isPremium = user?.subscription === "PREMIUM" || user?.subscription === "FAMILY";

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            localStorage.clear();
            setUser(null);
            window.location.replace("/login");
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Movies", href: "/media" },
        { name: "Pricing", href: "/pricing" },
        { name: "Watchlist", href: "/watchlist" },
    ];

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                    {/* Left: Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>

                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
                                CT
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-gray-900">
                                Cine<span className="text-indigo-600">Tube</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side: Auth Logic */}
                    <div className="flex items-center gap-5">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <button className="hidden sm:block p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 transition-all">
                                    <Bell className="w-5 h-5" />
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="flex items-center gap-3 p-1.5 pl-4 bg-gray-900 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200"
                                    >
                                        <div className="flex flex-col items-end">
                                            <span className="hidden sm:inline text-sm font-bold text-white uppercase tracking-wider">
                                                {user.name.split(' ')[0]}
                                            </span>
                                            {/* ✅ প্রিমিয়াম ব্যাজ */}
                                            {isPremium && (
                                                <span className="flex items-center gap-0.5 text-[9px] font-black text-amber-400 uppercase tracking-tighter">
                                                    <Crown className="w-2.5 h-2.5 fill-amber-400" /> PRO
                                                </span>
                                            )}
                                        </div>

                                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-white font-bold border-2 ${isPremium ? 'bg-gradient-to-br from-amber-400 to-orange-600 border-amber-300/50' : 'bg-indigo-500 border-indigo-400/20'}`}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isOpen && (
                                        <div className="absolute right-0 mt-4 w-64 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                                            <div className="px-4 py-4 border-b border-gray-50 mb-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
                                                    {isPremium && (
                                                        <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-amber-200">PREMIUM</span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-black text-gray-900 truncate">{user.email}</p>
                                            </div>

                                            <Link href="/user-profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
                                                <User className="w-4 h-4" /> My Profile
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all mt-1"
                                            >
                                                <LogOut className="w-4 h-4" /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link href="/login" className="px-4 sm:px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-all">
                                    Login
                                </Link>
                                <Link href="/register" className="px-4 sm:px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all">
                                    Join
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar (বাকি অংশ একই আছে...) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[101] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-10">
                        <span className="text-xl font-black text-gray-900 italic">MENU</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-xl bg-gray-50 text-gray-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-6 py-4 rounded-2xl text-lg font-black text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* মোবাইল মেনুতে প্রিমিয়াম স্ট্যাটাস */}
                    {user && isPremium && (
                        <div className="mt-6 mx-2 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                            <div className="flex items-center gap-2 text-amber-700 font-black text-sm uppercase">
                                <Crown className="w-4 h-4 fill-amber-500" />
                                Premium Member
                            </div>
                        </div>
                    )}

                    <div className="mt-10 pt-10 border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Support</p>
                        <Link href="/help" className="text-sm font-bold text-gray-600 block px-6 py-2">Help Center</Link>
                        <Link href="/terms" className="text-sm font-bold text-gray-600 block px-6 py-2">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </>
    );
}