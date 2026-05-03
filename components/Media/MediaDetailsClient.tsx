"use client";
import React, { useState } from "react";
import { Play, ChevronLeft, Share2, Heart, ThumbsUp, MoreVertical, BookmarkPlus, Check } from "lucide-react";
import Link from "next/link";
import ReviewSection from "./Review/ReviewSection";
import MovieChat from "@/components/MovieChat";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner"; // আপনি চাইলে react-hot-toast বা sonner ব্যবহার করতে পারেন

export default function MediaDetailsClient({ movie }: { movie: any }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // See more logic
    const queryClient = useQueryClient();

    // ১. সাজেস্টেড মুভি লিস্ট আনা
    const { data: relatedData } = useQuery({
        queryKey: ["all-media"],
        queryFn: async () => {
            const res = await axiosInstance.get("/media");
            return res.data?.data?.data || [];
        }
    });

    // ২. Watchlist এর জন্য ফিক্স
    const { mutate: addToWatchlist } = useMutation({
        mutationFn: async () => {
            // বডিতে mediaId পাঠাতে হবে
            return await axiosInstance.post(`/watchlist`, {
                mediaId: movie.id  // ✅ এই লাইনটি যোগ করুন
            });
        },
        onSuccess: () => {
            toast.success("Added to Watchlist!");
        }
    });
    // ৪. Share Link Copy Logic
    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    const getYouTubeId = (url: string) => {
        const match = url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-red-600/30">
            {/* টপ ন্যাভ */}
            <div className="px-4 py-3 flex items-center bg-[#0f0f0f]/80 backdrop-blur-md sticky top-0 z-[110] border-b border-white/5">
                <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-all">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <span className="ml-4 font-black uppercase italic tracking-tighter text-sm text-gray-400">Now Playing: {movie?.title}</span>
            </div>

            <main className="max-w-[1750px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* বাম পাশ */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/5 group">
                        {isPlaying ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${getYouTubeId(movie?.youtubeLink)}?autoplay=1&rel=0`}
                                allowFullScreen
                                allow="autoplay"
                            />
                        ) : (
                            <div className="absolute inset-0 cursor-pointer overflow-hidden" onClick={() => setIsPlaying(true)}>
                                <img src={movie?.backdropUrl || movie?.posterUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70" alt="" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.3)] group-hover:scale-110 group-hover:bg-red-500 transition-all">
                                        <Play className="w-8 h-8 fill-current ml-1 text-white" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-black uppercase italic leading-tight text-white/90">{movie?.title}</h1>

                        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-700 rounded-full flex items-center justify-center font-black text-xl border border-white/10">C</div>
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-tight">CineTube Official</h4>
                                    <p className="text-[10px] text-gray-500 font-bold">Verified Content</p>
                                </div>

                            </div>

                            <div className="flex items-center gap-2">


                                {/* Share Logic */}
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 font-bold text-xs transition-all"
                                >
                                    <Share2 className="w-4 h-4" /> Share
                                </button>

                                {/* Watchlist Logic */}
                                <button
                                    onClick={() => addToWatchlist()}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 font-bold text-xs transition-all"
                                >
                                    <BookmarkPlus className="w-4 h-4" /> Watchlist
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ডেসক্রিপশন বক্স (See More Logic) */}
                    <div className="bg-white/5 rounded-2xl p-5 hover:bg-white/[0.07] transition-all">
                        <div className="flex gap-4 mb-3 text-xs font-black uppercase text-gray-400">
                            <span>{movie?.views || "0"} Views</span>
                            <span>Released {new Date(movie?.createdAt).getFullYear()}</span>
                        </div>
                        <p className={`text-gray-300 text-sm md:text-base leading-relaxed font-medium transition-all ${!isExpanded ? 'line-clamp-2' : ''}`}>
                            {movie?.description || "No description available for this movie."}
                        </p>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2 text-xs font-black uppercase text-indigo-400 hover:text-indigo-300"
                        >
                            {isExpanded ? "Show Less" : "...more"}
                        </button>
                    </div>

                    <div className="pt-4">
                        <ReviewSection mediaId={movie.id} />
                    </div>
                </div>

                {/* সাজেস্টেড লিস্ট (ডান পাশ) */}
                <div className="lg:col-span-4 space-y-5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Suggested For You</h3>
                    <div className="space-y-4 max-h-[1200px] overflow-y-auto pr-2 custom-scrollbar">
                        {relatedData?.filter((m: any) => m.id !== movie.id).map((item: any) => (
                            <Link key={item.id} href={`/media/${item.id}`} className="flex gap-3 group">
                                <div className="relative w-44 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-white/5 border border-white/5">
                                    <img src={item.posterUrl || item.backdropUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                                </div>
                                <div className="flex-1 py-1">
                                    <h4 className="text-[13px] font-black uppercase leading-tight line-clamp-2 group-hover:text-red-500 transition-colors">{item.title}</h4>
                                    <p className="text-[10px] text-gray-600 font-black mt-1">{item.views || "0"} views • {new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* AI Chatbot */}
            <MovieChat movieId={movie.id} />
        </div>
    );
}