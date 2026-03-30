// app/(dashboard)/user-profile/page.tsx
import { Play, Clock, Heart, ShieldCheck, Settings } from "lucide-react";

export default function UserDashboard() {
    const user = {
        name: "Rakib Hasan",
        plan: "Premium Member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rakib", // ডামি অবতার
    };

    const watchlist = [
        { title: "The Dark Knight", year: "2008", image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400" },
        { title: "Interstellar", year: "2014", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=400" },
        { title: "Inception", year: "2010", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-10">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* 1. Header & Profile Card */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-3xl bg-indigo-100 overflow-hidden border-4 border-indigo-50">
                            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome, {user.name.split('')[0]} 👋</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> {user.plan}
                                </span>
                                <span className="text-gray-400 text-sm font-medium">Member since 2026</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-4 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="px-6 py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                            Upgrade Plan
                        </button>
                    </div>
                </div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
                            <Heart className="w-6 h-6 fill-pink-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Favorite Movies</p>
                            <h4 className="text-2xl font-black text-gray-900">24</h4>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Watch Time</p>
                            <h4 className="text-2xl font-black text-gray-900">128h</h4>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                            <Play className="w-6 h-6 fill-green-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Completed</p>
                            <h4 className="text-2xl font-black text-gray-900">42</h4>
                        </div>
                    </div>
                </div>

                {/* 3. My Watchlist Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Watchlist</h2>
                        <button className="text-sm font-bold text-indigo-600 hover:underline">View All</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {watchlist.map((item, i) => (
                            <div key={i} className="group relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                                <div className="aspect-video w-full overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="h-12 w-12 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-xl">
                                            <Play className="w-5 h-5 fill-indigo-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                                    <p className="text-sm font-medium text-gray-400 mt-1">{item.year} • Movie</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}