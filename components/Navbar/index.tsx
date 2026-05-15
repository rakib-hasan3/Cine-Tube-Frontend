"use client";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { User, LogOut, ChevronDown, Menu, X, Crown, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import axiosInstance from "@/lib/axios";
import NavItem from "./NavItem";
import SearchModal from "./SearchModal";

import { useSearchStore } from "@/hooks/useSearchStore";

export default function Navbar() {
    const { user, setUser, isLoading } = useAuth();
    const pathname = usePathname();
    const { openSearch } = useSearchStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isPremium = user?.subscription === "PREMIUM" || user?.subscription === "FAMILY";
    const noNavbarRoutes = [
        "/admin-dashboard", 
        "/media-management", 
        "/user-management", 
        "/review-moderation", 
        "/admin-settings"
    ];

    const isMediaDetailPage = pathname?.startsWith("/media/") && pathname !== "/media";
    const isWatchPage = pathname?.startsWith("/watch/");

    if (noNavbarRoutes.some(route => pathname?.startsWith(route)) || isMediaDetailPage || isWatchPage) {
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

    // Navigation logic based on auth state
    // To prevent layout shift during loading, we can render a minimal state or null
    const navLinks = !isLoading && user 
        ? [
            { name: "Home", href: "/" },
            { name: "Movies", href: "/media" },
            { name: "Pricing", href: "/pricing" },
            { name: "Watchlist", href: "/watchlist" },
        ]
        : [
            { name: "Home", href: "/" },
            { name: "Pricing", href: "/pricing" },
        ];

    return (
        <>
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 bg-black border-b border-white/5 ${isScrolled ? "py-3 shadow-2xl shadow-black/50" : "py-5"}`}>
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between relative">

                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
                                CT
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                Cine<span className="text-indigo-500 font-black">Tube</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Menu Links */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
                        {navLinks.map((link) => (
                            <NavItem 
                                key={link.href} 
                                {...link} 
                                isActive={pathname === link.href} 
                            />
                        ))}
                    </div>

                    {/* Right Side: Search, Profile, Mobile Menu */}
                    <div className="flex items-center gap-6">
                        {/* Search Icon - Only if logged in */}
                        {!isLoading && user && (
                            <button 
                                onClick={openSearch}
                                className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        )}

                        {/* Desktop Only: User Profile / Auth Buttons */}
                        <div className="hidden md:flex items-center gap-4 min-w-[120px] justify-end">
                            {isLoading ? (
                                <div className="h-10 w-10 rounded-xl bg-white/5 animate-pulse" />
                            ) : user ? (
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsOpen(!isOpen)} 
                                        className="flex items-center gap-3 p-1.5 pl-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/10"
                                    >
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{user.name.split(' ')[0]}</span>
                                            {isPremium && (
                                                <span className="flex items-center gap-0.5 text-[8px] font-black text-amber-400 uppercase tracking-tighter">
                                                    <Crown className="w-2.5 h-2.5 fill-amber-400" /> PRO
                                                </span>
                                            )}
                                        </div>
                                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-white font-bold border-2 transition-all duration-300 ${isPremium ? 'bg-gradient-to-br from-amber-400 to-orange-600 border-amber-300/50' : 'bg-indigo-600 border-indigo-400/20'}`}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isOpen && (
                                        <>
                                            <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
                                            <div className="absolute right-0 mt-4 w-64 bg-[#0a0a0a] rounded-2xl shadow-2xl border border-white/10 p-2 animate-in fade-in zoom-in duration-300">
                                                <div className="px-4 py-4 border-b border-white/5 mb-1">
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account</p>
                                                    <p className="text-sm font-bold text-white truncate">{user.email}</p>
                                                </div>
                                                <Link href="/user-profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-300">
                                                    <User className="w-4 h-4" /> My Profile
                                                </Link>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all duration-300 mt-1 border-t border-white/5 pt-3">
                                                    <LogOut className="w-4 h-4" /> Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-all duration-300 px-4 py-2">
                                        Login
                                    </Link>
                                    <Link href="/register" className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-600/20">
                                        Join Now
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Hamburger Menu (Mobile Only) */}
                        <button
                            className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-[110] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)} />

                {/* Sidebar Content */}
                <div className={`absolute top-0 right-0 h-full w-[300px] bg-[#0a0a0a] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out p-8 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex items-center justify-between mb-12">
                        <span className="text-xl font-black text-white italic tracking-tighter uppercase">Menu</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-xl bg-white/5 text-gray-400 border border-white/10 hover:text-white transition-colors duration-300">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation Links in Sidebar */}
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-6 py-4 rounded-2xl text-lg font-bold transition-all duration-300 ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/5">
                        {isLoading ? (
                            <div className="h-20 w-full rounded-2xl bg-white/5 animate-pulse" />
                        ) : user ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-white leading-none mb-1 truncate">{user.name}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <Link href="/user-profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-gray-400 font-bold hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300">
                                    <User className="w-5 h-5" /> Profile
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-4 text-rose-500 font-bold hover:bg-rose-500/10 rounded-2xl transition-all duration-300">
                                    <LogOut className="w-5 h-5" /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-gray-400 font-bold border-2 border-white/5 rounded-2xl hover:bg-white/5 transition-all duration-300">Login</Link>
                                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all duration-300">Join Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            <SearchModal />
        </>
    );
}