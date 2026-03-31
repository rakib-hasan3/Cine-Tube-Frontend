"use client";
import { useState } from "react";
import {
    Plus, Film, Users, TrendingUp,
    ArrowUpRight, PlayCircle, Clock, MoreHorizontal
} from "lucide-react";
import AddMediaForm from "@/components/admin/AddMediaForm";

export default function AdminPanel() {
    const [showForm, setShowForm] = useState(false);

    const stats = [
        { label: "Total Media", value: "1,284", icon: Film, trend: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active Users", value: "8,432", icon: Users, trend: "+18%", color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Monthly Revenue", value: "৳12,450", icon: TrendingUp, trend: "+5%", color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {showForm && <AddMediaForm onClose={() => setShowForm(false)} />}

            {/* 1. Glassmorphism Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Dashboard <span className="text-indigo-600">Overview</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Welcome back, Rakib! Here's what's happening today.</p>
                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-[2rem] font-bold shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Add New Media
                </button>
            </div>

            {/* 2. Advanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                        <div className="flex items-start justify-between">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <span className="flex items-center gap-1 text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                                {stat.trend} <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <h4 className="text-4xl font-black text-gray-900 mt-1">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Uploads (Table) */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-900">Recent Content</h2>
                        <button className="p-2 hover:bg-gray-50 rounded-xl transition-all"><MoreHorizontal className="w-5 h-5 text-gray-400" /></button>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    <th className="px-6 py-4">Media</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Performance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[1, 2, 3].map((_, i) => (
                                    <tr key={i} className="group hover:bg-gray-50/50 transition-all">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=100" alt="" className="object-cover h-full w-full" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-none">Inception</p>
                                                    <p className="text-xs text-gray-400 mt-1 font-medium italic">Sci-Fi • 2010</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full tracking-tighter">Published</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 w-[70%]" />
                                                </div>
                                                <span className="text-xs font-bold text-gray-600">70%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Activity Feed */}
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-black text-gray-900 mb-8">Activity Feed</h2>
                    <div className="space-y-8">
                        {[
                            { icon: PlayCircle, text: "Admin added 'Stranger Things'", time: "2m ago", color: "text-blue-500" },
                            { icon: Users, text: "50 new users joined today", time: "1h ago", color: "text-indigo-500" },
                            { icon: Clock, text: "Server maintenance finished", time: "5h ago", color: "text-gray-400" },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className={`mt-1 ${item.color}`}><item.icon className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800 leading-snug">{item.text}</p>
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 border-2 border-dashed border-gray-100 rounded-2xl text-sm font-bold text-gray-400 hover:border-indigo-200 hover:text-indigo-500 transition-all">
                        View All Logs
                    </button>
                </div>

            </div>
        </div>
    );
}