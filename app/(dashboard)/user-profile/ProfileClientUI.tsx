"use client";
import React from "react";
import {
    Mail, LogOut, Camera, Calendar,
    ShieldCheck, Crown, Settings, ChevronRight,
    User, Bell, CreditCard
} from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function ProfileClientUI({ initialUser }: { initialUser: any }) {
    const router = useRouter();
    const user = initialUser || {};
    const userId = user.id || user._id;

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        Cookies.remove("accessToken");
        router.push("/login");
        router.refresh();
    };

    const goToEditPage = () => {
        if (userId) router.push(`/user-profile/${userId}`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-20 font-sans">
            {/* প্রিমিয়াম ব্যাকগ্রাউন্ড গ্লো */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 pt-10 relative z-10">

                {/* প্রোফাইল হেডার কার্ড */}
                <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* অভাতার সেকশন */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-indigo-500/30 p-1 shadow-[0_0_50px_rgba(79,70,229,0.2)]">
                                <img
                                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'User'}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <button className="absolute bottom-2 right-2 p-2.5 bg-indigo-600 rounded-full hover:scale-110 transition-transform shadow-lg border-2 border-[#050505]">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        {/* ইউজার ইনফো */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                                    {user.name || "Guest User"}
                                </h1>
                                {/* সাবস্ক্রিপশন ব্যাজ */}
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.subscription === 'PREMIUM' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                                    <Crown className="w-3 h-3" /> {user.subscription || "Free Member"}
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 text-gray-400 font-medium">
                                <p className="flex items-center justify-center md:justify-start gap-2 text-sm hover:text-white transition-colors cursor-pointer">
                                    <Mail className="w-4 h-4 text-indigo-500" /> {user.email}
                                </p>
                                <p className="flex items-center justify-center md:justify-start gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-indigo-500" /> Member since {new Date(user.createdAt).getFullYear()}
                                </p>
                            </div>
                        </div>

                        {/* অ্যাকশন বাটন */}
                        <div className="flex flex-col gap-3 min-w-[200px]">
                            <button onClick={goToEditPage} className="w-full py-3.5 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95">
                                <Settings className="w-4 h-4" /> Edit Profile
                            </button>
                            <button onClick={handleLogout} className="w-full py-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all active:scale-95">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* মেইন কন্টেন্ট গ্রিড */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* বাম পাশ - সেটিংস লিস্ট */}
                    <div className="lg:col-span-4 space-y-4">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] ml-2 mb-4">Account Settings</h2>

                        {[
                            { label: "Personal Information", icon: User, color: "text-blue-500" },
                            { label: "Subscription Plan", icon: CreditCard, color: "text-amber-500" },
                            { label: "Security & Privacy", icon: ShieldCheck, color: "text-emerald-500" },
                            { label: "Notifications", icon: Bell, color: "text-purple-500" },
                        ].map((item, i) => (
                            <button key={i} className="w-full group flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] hover:bg-white/[0.05] hover:border-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl bg-white/5 ${item.color}`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-gray-200">{item.label}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                            </button>
                        ))}
                    </div>

                    {/* ডান পাশ - সাবস্ক্রিপশন কার্ড */}
                    <div className="lg:col-span-8">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-1 shadow-xl shadow-indigo-500/10">
                            <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[2.4rem] p-8 h-full">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black mb-1 italic tracking-tight">CINE-TUBE PREMIUM</h3>
                                        <p className="text-gray-400 text-sm">Your cinematic journey is just a click away.</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-2xl">
                                        <Crown className="w-8 h-8 text-amber-500" />
                                    </div>
                                </div>

                                {user.subscription === 'PREMIUM' ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                            <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                            <div>
                                                <p className="font-bold text-emerald-500">Active Subscription</p>
                                                <p className="text-xs text-gray-400">Renews on {new Date(user.planExpiresAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
                                            Manage Subscription
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center py-6">
                                        <p className="text-gray-300 mb-6 max-w-sm">Upgrade to Premium to unlock 4K streaming, offline downloads, and an ad-free experience.</p>
                                        <button
                                            onClick={() => router.push('/pricing')}
                                            className="px-10 py-4 bg-indigo-600 rounded-2xl font-black tracking-widest uppercase text-xs hover:scale-105 transition-all shadow-xl shadow-indigo-600/30"
                                        >
                                            Upgrade Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}