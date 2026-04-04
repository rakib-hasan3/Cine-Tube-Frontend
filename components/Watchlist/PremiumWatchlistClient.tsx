"use client";
import { useState } from "react";
import { Trash2, Play, Star, Bookmark, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner"; // টোস্ট মেসেজের জন্য (ঐচ্ছিক)

export default function PremiumWatchlistClient({ initialWatchlist }: { initialWatchlist: any[] }) {
    const [watchlist, setWatchlist] = useState(initialWatchlist);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ১. ওয়াচলিস্ট থেকে রিমুভ করার লজিক
    const handleRemove = async (movieId: string) => {
        setDeletingId(movieId);
        try {
            // await axiosInstance.delete(`/watchlist/${movieId}`);
            setWatchlist((prev) => prev.filter((item) => item.id !== movieId));
            toast.success("Removed from watchlist");
        } catch (error) {
            toast.error("Failed to remove item");
        } finally {
            setDeletingId(null);
        }
    };

    if (watchlist.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01] backdrop-blur-3xl">
                <div className="p-6 bg-white/5 rounded-full mb-6">
                    <Bookmark className="w-12 h-12 text-indigo-500/50" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Your collection is empty</h2>
                <p className="text-gray-500 font-medium mb-8">Start adding movies you want to watch later.</p>
                <Link href="/media" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                    Discover Movies
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="text-indigo-500 font-black uppercase tracking-[0.4em] text-[10px]">Personal Collection</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-2 text-white">My <span className="text-indigo-500">Watchlist.</span></h1>
                </div>
                <p className="text-gray-500 font-bold text-sm uppercase tracking-widest pb-2">{watchlist.length} Movies Saved</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {watchlist.map((movie) => (
                    <div key={movie.id} className="group relative">
                        {/* কার্ড ডিজাইন */}
                        <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 group-hover:scale-[1.02] group-hover:border-indigo-500/50">
                            <img
                                src={movie.posterUrl}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                alt={movie.title}
                            />

                            {/* কাস্টম প্রিমিয়াম ওভারলে */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">

                                {/* রিমুভ বাটন */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemove(movie.id); }}
                                    disabled={deletingId === movie.id}
                                    className="absolute top-8 right-8 p-3.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl backdrop-blur-2xl border border-red-500/20 transition-all active:scale-90 flex items-center justify-center"
                                >
                                    {deletingId === movie.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                </button>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/20 backdrop-blur-md">
                                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                        <span className="text-xs font-black text-yellow-500">{movie.rating || "8.5"}</span>
                                    </div>
                                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">{movie.year}</span>
                                </div>

                                <h3 className="text-3xl font-black leading-tight text-white mb-6 uppercase tracking-tighter italic">
                                    {movie.title}
                                </h3>

                                <Link
                                    href={`/media/${movie.id}`}
                                    className="w-full flex items-center justify-center gap-3 py-5 bg-white text-black rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl"
                                >
                                    <Play className="w-4 h-4 fill-current" /> Watch Now
                                </Link>
                            </div>
                        </div>

                        {/* কার্ডের নিচের টেক্সট */}
                        <div className="mt-6 px-4">
                            <h4 className="text-lg font-bold text-gray-200 group-hover:text-indigo-400 transition-colors truncate">{movie.title}</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1 italic">{movie.genre?.[0] || "Featured"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}