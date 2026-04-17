"use client";
import { useEffect, useState, useCallback } from "react";
import {
    MessageSquare, Trash2, CheckCircle, XCircle, Clock,
    Search, Star, User, Film, Loader2
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import Swal from "sweetalert2";

export default function ReviewModeration() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // Initial page load loading
    const [searchTerm, setSearchTerm] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false); // Background refresh state

    const fetchReviews = useCallback(async (isInitial = false) => {
        if (isInitial) setLoading(true);
        else setIsRefreshing(true);

        try {
            const url = searchTerm ? `/reviews?searchTerm=${searchTerm}` : `/reviews`;
            const res = await axiosInstance.get(url);
            setReviews(res.data.data);
        } catch (err: any) {
            console.error("Error loading reviews:", err.response?.data);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchReviews(true); // সার্চ করলে বা প্রথমবার লোড হলে initial loading দেখাবে
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchReviews]);

    // স্ট্যাটাস আপডেট (Optimistic Update)
    const handleStatusUpdate = async (id: string, newStatus: string) => {
        // Optimistic Update (UI আগেই চেঞ্জ হবে)
        setReviews(prev => prev.map(rev =>
            rev.id === id ? { ...rev, status: newStatus } : rev
        ));

        try {
            await axiosInstance.patch(`/reviews/${id}/status`, { status: newStatus });

            // ছোট এবং অটো-ক্লোজ টোস্ট
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

            Toast.fire({
                icon: 'success',
                title: `Review ${newStatus.toLowerCase()}`
            });

        } catch (err) {
            // এরর হলে আগের অবস্থায় ফেরত যাবে
            fetchReviews();
            Swal.fire('Error', 'Failed to update', 'error');
        }
    };
    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will remove the review permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            confirmButtonText: 'Yes, Delete'
        });

        if (result.isConfirmed) {
            try {
                // ডিলিট হওয়ার সাথে সাথে UI থেকে সরিয়ে দিচ্ছি
                setReviews(prev => prev.filter(rev => rev.id !== id));
                await axiosInstance.delete(`/reviews/${id}`);
                Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1000, showConfirmButton: false });
            } catch (err: any) {
                fetchReviews(); // এরর হলে আবার ডাটা ফেচ করে UI ঠিক করে দেব
                Swal.fire('Error', 'Check foreign key constraints', 'error');
            }
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    return (
        <div className="space-y-8 p-4 md:p-0">
            {/* Header with Background Refresh Indicator */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Review <span className="text-indigo-600">Moderation</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Manage user feedback.</p>
                    </div>
                    {isRefreshing && <Loader2 className="w-5 h-5 animate-spin text-indigo-400 mt-2" />}
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search user or movie..."
                        className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 w-full md:w-80 font-medium shadow-sm transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 min-h-[400px]">
                {loading ? (
                    <div className="h-60 flex flex-col items-center justify-center font-bold text-gray-400">
                        <Loader2 className="animate-spin text-indigo-600 w-10 h-10 mb-4" />
                        <span>Fetching Records...</span>
                    </div>
                ) : (
                    reviews.map((rev: any) => (
                        <div key={rev.id} className="group bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row gap-6 justify-between">
                                <div className="flex gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h4 className="font-black text-gray-900 text-lg">{rev.user?.name || "Anonymous User"}</h4>
                                            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-xs font-black">
                                                <Star className="w-3 h-3 fill-amber-600" /> {rev.rating}/5
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-colors duration-500 ${getStatusStyle(rev.status)}`}>
                                                {rev.status || 'PENDING'}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-indigo-500 font-bold text-sm">
                                            <Film className="w-4 h-4" />
                                            <span>{rev.media?.title || "Unknown Media"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
                                        <button
                                            onClick={() => handleStatusUpdate(rev.id, 'APPROVED')}
                                            className={`p-2.5 rounded-xl transition-all ${rev.status === 'APPROVED' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600 hover:bg-white'}`}
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(rev.id, 'REJECTED')}
                                            className={`p-2.5 rounded-xl transition-all ${rev.status === 'REJECTED' ? 'bg-rose-600 text-white shadow-lg' : 'text-gray-400 hover:text-rose-600 hover:bg-white'}`}
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(rev.id, 'PENDING')}
                                            className={`p-2.5 rounded-xl transition-all ${rev.status === 'PENDING' || !rev.status ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-400 hover:text-amber-500 hover:bg-white'}`}
                                        >
                                            <Clock className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button onClick={() => handleDelete(rev.id)} className="p-3.5 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all ml-2">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 relative">
                                <p className="text-gray-600 font-medium italic">"{rev.content || rev.comment}"</p>
                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Posted: {new Date(rev.createdAt).toLocaleString()}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400">ID: #{rev.id.slice(-6)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {!loading && reviews.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-400">No reviews found!</h3>
                    </div>
                )}
            </div>
        </div>
    );
}