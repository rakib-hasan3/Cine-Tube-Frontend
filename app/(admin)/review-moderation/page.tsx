"use client";
import { useEffect, useState } from "react";
import {
    MessageSquare, Trash2, CheckCircle, XCircle,
    Search, Star, Filter, MoreHorizontal, User, Film
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import Swal from "sweetalert2";

export default function ReviewModeration() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const url = searchTerm
                ? `/reviews?searchTerm=${searchTerm}`
                : `/reviews`; // ✅ empty হলে param দিবা না

            const res = await axiosInstance.get(url);
            setReviews(res.data.data);
        } catch (err: any) {
            console.error("Error loading reviews:", err.response?.data); // 🔥 important
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [searchTerm]);
    // handel status update
    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await axiosInstance.patch(`/reviews/${id}/status`, { status });
            Swal.fire('Updated!', `Review is now ${status}`, 'success');
            fetchReviews(); // লিস্ট রিফ্রেশ হবে
        } catch (err) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };
    // ২. রিভিউ ডিলিট করা
    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Delete Comment?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            confirmButtonText: 'Yes, Delete'
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.delete(`/reviews/${id}`);
                Swal.fire('Deleted!', 'The review has been removed.', 'success');
                fetchReviews();
            } catch (err) {
                Swal.fire('Error', 'Failed to delete', 'error');
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Review <span className="text-indigo-600">Moderation</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Manage user feedback and maintain community standards.</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by user or movie..."
                        className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 w-full md:w-80 font-medium shadow-sm transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Reviews Grid/List */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="h-40 flex items-center justify-center font-bold text-gray-400">Loading Reviews...</div>
                ) : (
                    reviews.map((rev: any) => (
                        <div key={rev.id} className="group bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                            <div className="flex flex-col md:flex-row gap-6 justify-between">

                                {/* User & Content Info */}
                                <div className="flex gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-gray-900 text-lg">{rev.user?.name || "Anonymous User"}</h4>
                                            <span className="text-xs font-bold text-gray-300">•</span>
                                            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-xs font-black">
                                                <Star className="w-3 h-3 fill-amber-600" /> {rev.rating}/5
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-indigo-500 font-bold text-sm">
                                            <Film className="w-4 h-4" />
                                            <span>{rev.media?.title || "Unknown Media"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleStatusUpdate(rev.id, 'APPROVED')} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all">
                                        <CheckCircle className="w-4 h-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rev.id)}
                                        className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Review Text Body */}
                            <div className="mt-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 relative">
                                <MessageSquare className="absolute -top-3 -left-3 w-8 h-8 text-white fill-indigo-100 opacity-50" />
                                <p className="text-gray-600 font-medium leading-relaxed italic">
                                    "{rev.comment}"
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                        Posted on: {new Date(rev.createdAt).toLocaleDateString()}
                                    </span>
                                    {/* Status Indicator */}
                                    <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase">
                                        Status: Pending
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Empty State */}
                {!loading && reviews.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-400">No reviews to moderate!</h3>
                        <p className="text-gray-400 font-medium">Everything looks clean for now.</p>
                    </div>
                )}
            </div>
        </div>
    );
}