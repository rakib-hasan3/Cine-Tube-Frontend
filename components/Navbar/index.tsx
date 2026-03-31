"use client";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { User, LogOut, ChevronDown, Bell } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { user, setUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
                        CT
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-gray-900">
                        Cine<span className="text-indigo-600">Tube</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/movies" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Movies</Link>
                    <Link href="/series" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Series</Link>
                    <Link href="/pricing" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Pricing</Link>
                </div>

                {/* Right Side: Auth Logic */}
                <div className="flex items-center gap-5">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 transition-all">
                                <Bell className="w-5 h-5" />
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex items-center gap-3 p-1.5 pl-4 bg-gray-900 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 group"
                                >
                                    <span className="text-sm font-bold text-white uppercase tracking-wider">{user.name.split(' ')[0]}</span>
                                    <div className="h-8 w-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold border-2 border-indigo-400/20">
                                        {user.name.charAt(0)}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isOpen && (
                                    <div className="absolute right-0 mt-4 w-56 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
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
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-all">
                                Login
                            </Link>
                            <Link href="/register" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200">
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}