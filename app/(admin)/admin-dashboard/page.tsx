"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import {
    Plus, Film, Users, TrendingUp,
    ArrowUpRight, PlayCircle, Clock, MoreHorizontal, Loader2
} from "lucide-react";
import AddMediaForm from "@/components/admin/AddMediaForm";

export default function AdminPanel() {
    const [showForm, setShowForm] = useState(false);

    // ১. ব্যাকএন্ড থেকে ড্যাশবোর্ড ডেটা ফেচ করা
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const res = await axiosInstance.get("/admin/stats"); // আপনার এপিআই এন্ডপয়েন্ট
            return res.data.data;

        }

    });

    if (isLoading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400 font-black">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            LOADING DASHBOARD...
        </div>
    );

    // ব্যাকএন্ড থেকে আসা ডেটা ম্যাপ করা
    const stats = [
        {
            label: "Total Media",
            value: dashboardData?.totalMedia || "0",
            icon: Film,
            trend: `+${dashboardData?.mediaTrend}%`,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Active Users",
            value: dashboardData?.activeUsers || "0",
            icon: Users,
            trend: `+${dashboardData?.userTrend}%`,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            label: "Monthly Revenue",
            value: `$${dashboardData?.revenue || "0"}`,
            icon: TrendingUp,
            trend: `+${dashboardData?.revenueTrend}%`,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
    ];
    console.log(dashboardData?.revenue);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {showForm && <AddMediaForm onClose={() => setShowForm(false)} />}

            {/* Header */}
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

            {/* Stats Cards */}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Uploads - ডাইনামিক টেবিল */}
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
                                {dashboardData?.recentMedia?.map((item: any) => (
                                    <tr key={item.id} className="group hover:bg-gray-50/50 transition-all">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={item.poster || "https://placeholder.com/100"} alt="" className="object-cover h-full w-full" />

                                                </div>

                                                <div>
                                                    <p className="font-bold text-gray-900 leading-none">{item.title}</p>
                                                    <p className="text-xs text-gray-400 mt-1 font-medium italic">{item.genre} • {item.year}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full tracking-tighter">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${item.performance}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-gray-600">{item.performance}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity Feed - ডাইনামিক */}
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-black text-gray-900 mb-8">Activity Feed</h2>
                    <div className="space-y-8">
                        {dashboardData?.activities?.map((activity: any, i: number) => (
                            <div key={i} className="flex gap-4">
                                <div className="mt-1 text-indigo-500"><PlayCircle className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800 leading-snug">{activity.message}</p>
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}