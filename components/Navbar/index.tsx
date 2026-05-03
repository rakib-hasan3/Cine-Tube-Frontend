"use client";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { User, LogOut, ChevronDown, Bell, Menu, X, Crown } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function Navbar() {
    const { user, setUser } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isPremium = user?.subscription === "PREMIUM" || user?.subscription === "FAMILY";

    const adminRoutes = ["/admin-dashboard", "/media-management", "/user-management", "/review-moderation", "/admin-settings"];

    if (adminRoutes.some(route => pathname?.startsWith(route))) {
        return null;
    }

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
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
                            CT
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-gray-900">
                            Cine<span className="text-indigo-600">Tube</span>
                        </span>
                    </Link>

                    {/* Center: Desktop Menu Links */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative text-sm font-bold transition-all duration-300 ${isActive ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-indigo-600 rounded-full animate-in slide-in-from-left-full duration-500" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side: Desktop Auth & Hamburger for Mobile */}
                    <div className="flex items-center gap-4">
                        {/* Desktop Only: User Profile / Auth Buttons */}
                        <div className="hidden md:flex items-center gap-5">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 transition-all">
                                        <Bell className="w-5 h-5" />
                                    </button>
                                    <div className="relative">
                                        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 p-1.5 pl-4 bg-gray-900 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-bold text-white uppercase tracking-wider">{user.name.split(' ')[0]}</span>
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
                                        {/* Dropdown Menu */}
                                        {isOpen && (
                                            <div className="absolute right-0 mt-4 w-64 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-2 animate-in fade-in zoom-in duration-200">
                                                <div className="px-4 py-4 border-b border-gray-50 mb-1">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
                                                    <p className="text-sm font-black text-gray-900 truncate">{user.email}</p>
                                                </div>
                                                <Link href="/user-profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
                                                    <User className="w-4 h-4" /> My Profile
                                                </Link>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all mt-1">
                                                    <LogOut className="w-4 h-4" /> Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-all">Login</Link>
                                    <Link href="/register" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all">Join</Link>
                                </div>
                            )}
                        </div>

                        {/* Hamburger Menu (Mobile Only - Positioned Right) */}
                        <button
                            className="md:hidden p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)} />

                {/* Sidebar Content (Slides from Right) */}
                <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-out p-8 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex items-center justify-between mb-12">
                        <span className="text-xl font-black text-gray-900 italic tracking-tighter">MENU</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-xl bg-gray-50 text-gray-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation Links in Sidebar */}
                    <div className="flex flex-col gap-3">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-6 py-4 rounded-2xl text-lg font-black transition-all ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"}`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        {user ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 leading-none mb-1">{user.name}</p>
                                        <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{user.email}</p>
                                    </div>
                                </div>
                                <Link href="/user-profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-gray-700 font-bold hover:bg-indigo-50 rounded-2xl transition-all">
                                    <User className="w-5 h-5" /> Profile
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-4 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-all">
                                    <LogOut className="w-5 h-5" /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-gray-700 font-black border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">Login</Link>
                                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Join Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}