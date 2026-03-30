// app/(admin)/admin-panel/page.tsx
import { LayoutDashboard, Film, Users, Plus, TrendingUp, MoreVertical } from "lucide-react";

export default function AdminPanel() {
    const stats = [
        { label: "Total Media", value: "1,284", icon: Film, color: "bg-blue-50 text-blue-600" },
        { label: "Total Users", value: "8,432", icon: Users, color: "bg-indigo-50 text-indigo-600" },
        { label: "Revenue", value: "$12,450", icon: TrendingUp, color: "bg-green-50 text-green-600" },
    ];

    const recentUploads = [
        { title: "Stranger Things S5", status: "Published", date: "2 Hours ago", views: "1.2k" },
        { title: "The Batman", status: "Draft", date: "5 Hours ago", views: "0" },
        { title: "Oppenheimer", status: "Published", date: "Yesterday", views: "4.5k" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/30 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header with Quick Action */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin <span className="text-indigo-600">Console</span></h1>
                        <p className="text-gray-500 font-medium mt-1">Manage your content and monitor performance.</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                        <Plus className="w-5 h-5" /> Add New Media
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                <h4 className="text-2xl font-black text-gray-900">{stat.value}</h4>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Table Style */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-900">Recent Content</h2>
                        <button className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors">View All Activities</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Title</th>
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Uploaded</th>
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Views</th>
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentUploads.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6 font-bold text-gray-900">{item.title}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === "Published" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-500 font-medium">{item.date}</td>
                                        <td className="px-8 py-6 font-bold text-gray-700">{item.views}</td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}