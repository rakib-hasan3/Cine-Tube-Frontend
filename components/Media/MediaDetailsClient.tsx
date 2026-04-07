"use client";
import React, { useState } from "react";
import { Play, ChevronLeft, X, Share2, Heart, ThumbsUp, MoreVertical, BookmarkPlus } from "lucide-react";
import Link from "next/link";
import ReviewSection from "./Review/ReviewSection";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export default function MediaDetailsClient({ movie }: { movie: any }) {
    const [isPlaying, setIsPlaying] = useState(false);

    // ব্যাকেন্ড থেকে মুভি লিস্ট আনা (আপনার এপিআই অনুযায়ী)
    const { data: relatedData } = useQuery({
        queryKey: ["all-media"],
        queryFn: async () => {
            const res = await axiosInstance.get("/media");
            return res.data?.data?.data || [];
        }
    });

    const getYouTubeId = (url: string) => {
        const match = url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-red-600/30">
            {/* টপ ন্যাভ বা ব্যাক বাটন */}
            <div className="px-4 py-3 flex items-center bg-[#0f0f0f]/80 backdrop-blur-md sticky top-0 z-[110] border-b border-white/5">
                <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-all">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <span className="ml-4 font-black uppercase italic tracking-tighter text-sm text-gray-400">Now Playing: {movie?.title}</span>
            </div>

            <main className="max-w-[1750px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* বাম পাশ: ভিডিও + টাইটেল + কমেন্ট (Col 8) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* ১. ভিডিও প্লেয়ার (ইউটিউব মিডিয়াম সাইজ) */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/5 group">
                        {isPlaying ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${getYouTubeId(movie?.youtubeLink)}?autoplay=1&rel=0`}
                                allowFullScreen
                                allow="autoplay"
                            />
                        ) : (
                            <div
                                className="absolute inset-0 cursor-pointer overflow-hidden"
                                onClick={() => setIsPlaying(true)}
                            >
                                <img
                                    src={movie?.backdropUrl || movie?.posterUrl}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70"
                                    alt=""
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.3)] group-hover:scale-110 group-hover:bg-red-500 transition-all">
                                        <Play className="w-8 h-8 fill-current ml-1 text-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-black/80 px-2 py-1 rounded text-xs font-bold border border-white/10">
                                    Click to Play Trailer
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ২. মুভি টাইটেল ও একশন */}
                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-black uppercase italic leading-tight text-white/90">
                            {movie?.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-700 rounded-full flex items-center justify-center font-black text-xl border border-white/10">C</div>
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-tight">CineTube Official</h4>
                                    <p className="text-[10px] text-gray-500 font-bold">1.28M Subscribers</p>
                                </div>
                                <button className="ml-2 px-6 py-2.5 bg-white text-black hover:bg-red-600 hover:text-white rounded-full font-black text-xs uppercase transition-all shadow-lg">
                                    Join Now
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex bg-white/5 rounded-full border border-white/10 overflow-hidden">
                                    <button className="flex items-center gap-2 px-5 py-2.5 hover:bg-white/10 border-r border-white/10 transition-all group">
                                        <ThumbsUp className="w-4 h-4 group-hover:text-red-500" /> <span className="text-xs font-bold">12K</span>
                                    </button>
                                    <button className="px-5 py-2.5 hover:bg-white/10 transition-all group">
                                        <Heart className="w-4 h-4 group-hover:text-rose-500" />
                                    </button>
                                </div>
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 font-bold text-xs transition-all">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                                <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all">
                                    <BookmarkPlus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ৩. ডেসক্রিপশন বক্স (স্লিম ডিজাইন) */}
                    <div className="bg-white/5 rounded-2xl p-5 hover:bg-white/[0.07] transition-all group">
                        <div className="flex gap-4 mb-3 text-xs font-black uppercase text-gray-400">
                            <span>458K Views</span>
                            <span>Released 2026</span>
                            <span className="text-indigo-400">#4K_Ultra_HD</span>
                        </div>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all cursor-pointer">
                            {movie?.description || "Experience the thrill of a lifetime in this CineTube exclusive masterpiece. Every frame is crafted for excellence."}
                        </p>
                        <button className="mt-2 text-xs font-black uppercase text-white/50 hover:text-white">...more</button>
                    </div>

                    {/* ৪. কমেন্ট/রিভিউ সেকশন */}
                    <div className="pt-4">
                        <ReviewSection mediaId={movie.id} />
                    </div>
                </div>

                {/* ডান পাশ: সাজেস্টেড মুভি লিস্ট (Col 4) */}
                <div className="lg:col-span-4 space-y-5">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Suggested For You</h3>
                        <div className="flex gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase text-gray-400">Live</span>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[1200px] overflow-y-auto pr-2 custom-scrollbar">
                        {relatedData?.filter((m: any) => m.id !== movie.id).map((item: any) => (
                            <Link key={item.id} href={`/media/${item.id}`} className="flex gap-3 group animate-in fade-in slide-in-from-right duration-500">
                                <div className="relative w-44 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-white/5 border border-white/5 shadow-lg">
                                    <img
                                        src={item.posterUrl || item.backdropUrl}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={item.title}
                                    />
                                    <div className="absolute bottom-1 right-1 bg-black/90 px-1 py-0.5 rounded text-[9px] font-black tracking-widest text-white border border-white/10">
                                        4K HDR
                                    </div>
                                    {/* ওভারলে অন হোভার */}
                                    <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex-1 py-1">
                                    <h4 className="text-[13px] font-black uppercase leading-tight line-clamp-2 group-hover:text-red-500 transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">CineTube Premium</p>
                                    <p className="text-[10px] text-gray-600 font-black mt-1">1.2M views • 3 days ago</p>
                                </div>
                                <button className="self-start p-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-all">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </Link>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}