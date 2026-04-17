"use client";
import { useEffect, useState } from "react";
import {
    Search, Plus, Edit2, Trash2,
    ChevronLeft, ChevronRight, Film, Star
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import AddMediaForm from "@/components/admin/AddMediaForm";
import Swal from "sweetalert2";

export default function MediaManagement() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ totalPages: 1, totalItems: 0 });
    const [showForm, setShowForm] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<any>(null);

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

    const handleEdit = (item: any) => {
        setSelectedMedia(item);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedMedia(null);
        fetchMedia();
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action will soft delete the media!",
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
                fetchMedia();
            } catch (err) {
                Swal.fire('Error', 'Failed to delete media', 'error');
            }
        }
    };

    return (
        <div className="p-4 md:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {showForm && (
                <AddMediaForm
                    onClose={handleCloseForm}
                    initialData={selectedMedia}
                />
            )}

            {/* --- Header Section --- */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                        Media <span className="text-indigo-600">Console</span>
                    </h1>
                    <p className="text-gray-500 font-semibold mt-1">
                        Manage <span className="text-indigo-500">{meta?.totalItems || 0}</span> cinematic assets in your library.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1 lg:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search titles, genres, directors..."
                            className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-500/10 w-full font-medium shadow-xl shadow-gray-100/50 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { setSelectedMedia(null); setShowForm(true); }}
                        className="p-4 bg-indigo-600 text-white rounded-[1.5rem] hover:bg-indigo-700 shadow-2xl shadow-indigo-200 active:scale-95 transition-all flex items-center gap-2 group"
                    >
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="hidden md:block font-bold pr-2">Add New</span>
                    </button>
                </div>
            </div>

            {/* --- Desktop Premium Table (Visible on md+) --- */}
            <div className="hidden md:block bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl shadow-indigo-100/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-10 py-7 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Media Info</th>
                                <th className="px-10 py-7 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Production</th>
                                <th className="px-10 py-7 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Revenue Model</th>
                                <th className="px-10 py-7 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/80">
                            {loading ? (
                                [1, 2, 3, 4].map(n => <tr key={n} className="animate-pulse h-28 bg-gray-50/10" />)
                            ) : (
                                media.map((item: any) => (
                                    <tr key={item.id} className="group hover:bg-indigo-50/40 transition-all duration-300">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="relative h-20 w-14 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                                    <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                                                    <img src={item.posterUrl} className="relative h-full w-full object-cover rounded-xl shadow-lg border border-white" alt="" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-lg line-clamp-1">{item.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded uppercase tracking-tighter">
                                                            {item.type}
                                                        </span>
                                                        <span className="text-[11px] text-gray-400 font-bold tracking-tight">ID: {item.id.slice(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="font-bold text-gray-700 text-sm">{item.director}</p>
                                            <p className="text-xs font-bold text-gray-400 mt-1">{item.releaseYear}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <div className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full border ${item.priceType === 'PREMIUM' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${item.priceType === 'PREMIUM' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-wider">{item.priceType}</span>
                                                </div>
                                                <p className="text-sm font-black text-gray-900 ml-1">
                                                    {item.priceType === 'FREE' ? 'FREE ACCESS' : `$${item.price}.00`}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button onClick={() => handleEdit(item)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 border border-indigo-100 rounded-2xl shadow-sm hover:bg-indigo-600 hover:text-white font-bold text-xs transition-all">
                                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Mobile Card View (Visible on <md) --- */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    <div className="p-10 text-center font-bold text-gray-400">Loading Library...</div>
                ) : (
                    media.map((item: any) => (
                        <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-xl flex gap-5 active:scale-[0.98] transition-transform">
                            <img src={item.posterUrl} className="w-24 h-36 object-cover rounded-2xl shadow-lg" alt="" />
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg leading-tight line-clamp-2">{item.title}</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase mt-1">{item.type} • {item.releaseYear}</p>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded w-fit ${item.priceType === 'PREMIUM' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {item.priceType}
                                        </span>
                                        <span className="font-black text-indigo-600 text-base leading-none">
                                            {item.priceType === 'FREE' ? 'FREE' : `$${item.price}`}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="p-3 bg-gray-50 text-gray-600 rounded-2xl"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- Pagination Footer --- */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10">
                <p className="text-sm font-black text-gray-400 order-2 md:order-1 tracking-widest uppercase">
                    Page <span className="text-indigo-600">{page}</span> of {meta.totalPages}
                </p>
                <div className="flex gap-3 order-1 md:order-2 w-full md:w-auto">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="flex-1 md:flex-none flex items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-30 shadow-xl shadow-gray-100 active:scale-95 transition-all"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <button
                        disabled={page === meta.totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="flex-1 md:flex-none flex items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-30 shadow-xl shadow-gray-100 active:scale-95 transition-all"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}