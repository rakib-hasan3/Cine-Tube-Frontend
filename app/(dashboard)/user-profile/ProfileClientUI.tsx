"use client";
import React from "react";
import {
    Mail, LogOut, Camera, Calendar,
    ShieldCheck, PlayCircle, Heart, Clock
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
        if (userId) {
            router.push(`/user/${userId}`);
        } else {
            alert("User ID not found!");
        }
    };

    // ডাইনামিক স্ট্যাটাস (আপনার ব্যাকএন্ডে ডাটা থাকলে এগুলো সেখান থেকে আসবে)
    const stats = [
        { label: "Watched", value: user?.watchedCount || "12", icon: PlayCircle, color: "text-indigo-500" },
        { label: "Favorites", value: user?.favoritesCount || "08", icon: Heart, color: "text-red-500" },
        { label: "Watch Time", value: "24h", icon: Clock, color: "text-emerald-500" },
    ];

    return (
        <div className="text-white pb-20">
            {/* কভার ফটো সেকশন */}
            <div className="h-64 w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 relative">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            </div>

            <div className="max-w-5xl mx-auto px-6">
                {/* প্রোফাইল হেডার */}
                <div className="relative -mt-24 flex flex-col md:flex-row items-center md:items-end gap-6 mb-12">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-[#0a0a0a] shadow-2xl bg-[#111]">
                            <img
                                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'User'}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-2 right-2 p-3 bg-indigo-600 rounded-2xl hover:bg-indigo-500 transition-colors shadow-xl">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left pb-4">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-4xl font-black tracking-tighter">{user.name || "Guest User"}</h1>
                            {user.role === "ADMIN" && <ShieldCheck className="w-6 h-6 text-indigo-400" />}
                        </div>
                        <p className="text-gray-400 font-medium flex items-center justify-center md:justify-start gap-2 text-sm">
                            <Mail className="w-4 h-4" /> {user.email || "No email found"}
                        </p>
                    </div>

                    <div className="flex gap-3 pb-4">
                        <button onClick={goToEditPage} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all backdrop-blur-md">
                            Edit Profile
                        </button>
                        <button onClick={handleLogout} className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-2xl transition-all">
                            <LogOut className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* --- নতুন যুক্ত হওয়া অংশ: Stats & Details --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center gap-5 backdrop-blur-sm">
                            <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* বাম পাশের ডিটেইলস */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-500" /> Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Joined</p>
                                    <p className="font-medium text-gray-200">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Role</p>
                                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-black rounded-lg">
                                        {user.role || "USER"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ডান পাশের একটি সেকশন (যেমন: Watchlist Placeholder) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] h-full min-h-[300px] flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <PlayCircle className="w-10 h-10 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400">Your Watchlist is empty</h3>
                            <p className="text-gray-600 max-w-xs mt-2">Start adding movies or shows to keep track of what you want to watch next.</p>
                            <button className="mt-6 px-8 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-all">
                                Browse Movies
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}