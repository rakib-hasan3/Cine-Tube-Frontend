"use client";
import { useEffect, useState } from "react";
import {
    Search, Plus, Edit2, Trash2, Filter,
    ChevronLeft, ChevronRight, MoreVertical, Film
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import AddMediaForm from "@/components/admin/AddMediaForm";
import Swal from "sweetalert2"; // ডিলিট কনফার্মেশনের জন্য (npm i sweetalert2)

export default function MediaManagement() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ totalPages: 1 });
    const [showForm, setShowForm] = useState(false);

    // ১. ডাটা ফেচ করা (getAllMedia সার্ভিস অনুযায়ী)
    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/media?searchTerm=${searchTerm}&page=${page}&limit=8`);

            setMedia(res.data.data.data);
            setMeta(res.data.data.meta);
        } catch (err) {
            console.error("Error loading media:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [searchTerm, page]);

    // ২. ডিলিট হ্যান্ডলার (deleteMedia সার্ভিস অনুযায়ী)
    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "It will be soft deleted from the library!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#f43f5e',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.delete(`/media/${id}`);
                Swal.fire('Deleted!', 'Media has been removed.', 'success');
                fetchMedia(); // লিস্ট রিফ্রেশ
            } catch (err) {
                Swal.fire('Error', 'Failed to delete media', 'error');
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {showForm && <AddMediaForm onClose={() => { setShowForm(false); fetchMedia(); }} />}

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Media <span className="text-indigo-600">Library</span></h1>
                    <p className="text-gray-500 font-medium">Total {meta?.totalPages || 0} items in your database.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by title, director..."
                            className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 w-full md:w-80 font-medium shadow-sm transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Poster & Title</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Director</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Release</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Price Type</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1, 2, 3, 4].map(n => <tr key={n} className="animate-pulse px-8 py-10 h-20 bg-gray-50/20" />)
                            ) : (
                                media.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                                    <img src={item.posterUrl || "https://placehold.co/400x600/EEE/31343C?text=No+Image"} className="object-cover h-full w-full" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.title}</p>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">{item.type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-medium text-gray-600">{item.director}</td>
                                        <td className="px-8 py-5 font-bold text-gray-400">{item.releaseYear}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.priceType === 'PREMIUM' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {item.priceType}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-sm font-bold text-gray-400">Page {page} of {meta.totalPages}</p>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            disabled={page === meta.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}