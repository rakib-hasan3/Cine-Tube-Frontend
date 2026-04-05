"use client";
import React, { useState } from "react";
import {
    Play, Star, Clock, Calendar, ChevronLeft,
    Plus, Lock, DollarSign, CheckCircle2, Loader2
} from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner"; // নোটিফিকেশনের জন্য


export default function MediaDetailsClient({ movie }: { movie: any }) {
    const [showPlayer, setShowPlayer] = useState(false);
    const queryClient = useQueryClient();

    // ১. ওয়াচলিস্টে অ্যাড করার মিউটেশন
    const { mutate: handleWatchlist, isPending } = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.post(`/watchlist`, { mediaId: movie.id });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Successfully added to watchlist!");
            queryClient.invalidateQueries({ queryKey: ["watchlist"] }); // ওয়াচলিস্ট আপডেট করবে
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to add to watchlist");
        }
    });

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const canWatch = movie?.priceType !== "PREMIUM" || movie?.isPurchased;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* হিরো সেকশন */}
            <div className="relative h-[75vh] w-full overflow-hidden bg-black">
                {!showPlayer ? (
                    <>
                        <img src={movie?.backdropUrl || movie?.posterUrl} className="w-full h-full object-cover opacity-50 scale-105" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            {canWatch ? (
                                <button onClick={() => setShowPlayer(true)} className="group flex flex-col items-center gap-4 transition-transform hover:scale-110">
                                    <div className="w-24 h-24 flex items-center justify-center bg-indigo-600 rounded-full shadow-[0_0_50px_rgba(79,70,229,0.6)]">
                                        <Play className="w-10 h-10 fill-current ml-2" />
                                    </div>
                                    <span className="font-black text-2xl uppercase italic">Watch Now</span>
                                </button>
                            ) : (
                                <div className="text-center p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-[3rem]">
                                    <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                                    <button className="w-full py-4 bg-yellow-500 text-black font-black rounded-2xl hover:bg-yellow-400 flex items-center justify-center gap-2">
                                        <DollarSign className="w-5 h-5" /> Buy for ${movie?.price || '9.99'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full relative">
                        <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${getYouTubeId(movie?.youtubeLink)}?autoplay=1&rel=0`} allowFullScreen />
                        <button onClick={() => setShowPlayer(false)} className="absolute top-10 right-10 p-3 bg-black/50 rounded-full"><Plus className="w-6 h-6 rotate-45" /></button>
                    </div>
                )}
                <Link href="/" className="absolute top-10 left-10 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10"><ChevronLeft className="w-6 h-6" /></Link>
            </div>

            {/* কন্টেন্ট ইনফো */}
            <div className="container mx-auto px-6 md:px-12 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="w-80 hidden md:block">
                        <img src={movie?.posterUrl} className="w-full aspect-[2/3] object-cover rounded-[2.5rem] border-4 border-white/5 shadow-2xl" alt="" />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase italic tracking-tighter">{movie?.title}</h1>

                        <div className="flex flex-wrap gap-5">
                            <button onClick={() => canWatch && setShowPlayer(true)} className={`flex items-center gap-3 px-10 py-5 ${canWatch ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-800 cursor-not-allowed'} rounded-[2rem] font-black text-xl transition-all`}>
                                <Play className="w-6 h-6 fill-current" /> {canWatch ? "Watch Now" : "Locked"}
                            </button>

                            {/* ২. ওয়াচলিস্ট বাটন */}
                            <button
                                onClick={() => handleWatchlist()}
                                disabled={isPending}
                                className="flex items-center gap-3 px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] font-black text-xl hover:bg-white/10 transition-all disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="w-6 h-6 animate-spin text-indigo-500" /> : <Plus className="w-6 h-6" />}
                                Add to Watchlist
                            </button>
                        </div>

                        <div className="mt-10 p-8 bg-white/5 border border-white/5 rounded-[3rem]">
                            <h3 className="text-xl font-black mb-4 uppercase italic">Storyline</h3>
                            <p className="text-gray-400 text-lg leading-relaxed">{movie?.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}