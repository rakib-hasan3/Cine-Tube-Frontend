"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import {
    Play, Star, Clock, Calendar, ChevronLeft,
    Loader2, Plus, Lock, DollarSign, CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function MediaDetails() {
    const { id } = useParams();
    const [showPlayer, setShowPlayer] = useState(false);

    const { data: movie, isLoading } = useQuery({
        queryKey: ["movie-details", id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/media/${id}`);
            return res.data.data;
        }
    });

    // ইউটিউব আইডি বের করার ফাংশন
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    // কন্ডিশনাল চেকিং (ইউজার কি এটি দেখতে পারবে?)
    const isPremium = movie?.priceType === "PREMIUM";
    const hasPurchased = movie?.isPurchased; // আপনার এপিআই থেকে এই ফ্ল্যাগটা আসা উচিত
    const canWatch = !isPremium || hasPurchased;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* SEO Meta Tags (Next.js Metadata API ইউজ করলে ভালো, নয়তো এখানে টাইটেল দিন) */}
            <title>{`${movie?.title} - CineTube`}</title>

            {/* ১. হিরো ও প্লেয়ার সেকশন */}
            <div className="relative h-[75vh] w-full overflow-hidden bg-black">
                {!showPlayer ? (
                    <>
                        <img
                            src={movie?.backdropUrl || movie?.posterUrl}
                            className="w-full h-full object-cover opacity-50 scale-105 transition-all duration-700"
                            alt={movie?.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                        {/* প্লে বাটন বা লক বাটন */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {canWatch ? (
                                <button
                                    onClick={() => setShowPlayer(true)}
                                    className="group flex flex-col items-center gap-4 transition-transform hover:scale-110"
                                >
                                    <div className="w-24 h-24 flex items-center justify-center bg-indigo-600 rounded-full shadow-[0_0_50px_rgba(79,70,229,0.6)] group-hover:bg-indigo-500">
                                        <Play className="w-10 h-10 fill-current ml-2" />
                                    </div>
                                    <span className="font-black text-2xl tracking-tighter uppercase italic">Watch Trailer / Movie</span>
                                </button>
                            ) : (
                                <div className="text-center p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-[3rem] max-w-md">
                                    <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                                    <h2 className="text-3xl font-black mb-2 italic">PREMIUM CONTENT</h2>
                                    <p className="text-gray-400 mb-6">This content requires a one-time purchase or active subscription to watch.</p>
                                    <button className="w-full py-4 bg-yellow-500 text-black font-black rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2">
                                        <DollarSign className="w-5 h-5" /> Buy Now for ${movie?.price || '9.99'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${getYouTubeId(movie?.youtubeLink)}?autoplay=1&rel=0&modestbranding=1`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <button
                            onClick={() => setShowPlayer(false)}
                            className="absolute top-10 right-10 p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-red-500 transition-all"
                        >
                            <Plus className="w-6 h-6 rotate-45" />
                        </button>
                    </div>
                )}

                {/* ব্যাক বাটন */}
                <Link href="/" className="absolute top-10 left-10 p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/10 group">
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* ২. কন্টেন্ট সেকশন */}
            <div className="container mx-auto px-6 md:px-12 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* পোস্টার কার্ড */}
                    <div className="w-full md:w-80 flex-shrink-0 hidden md:block">
                        <div className="aspect-[2/3] rounded-[2.5rem] overflow-hidden border-4 border-white/5 shadow-2xl shadow-black/50">
                            <img src={movie?.posterUrl} className="w-full h-full object-cover" alt={movie?.title} />
                        </div>
                    </div>

                    {/* মুভি ইনফো */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            {isPremium ? (
                                <span className="px-4 py-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-black uppercase tracking-widest">Premium</span>
                            ) : (
                                <span className="px-4 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-black uppercase tracking-widest">Free</span>
                            )}
                            {hasPurchased && <span className="flex items-center gap-1 text-indigo-400 text-xs font-bold"><CheckCircle2 className="w-3 h-3" /> Purchased</span>}
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            {movie?.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-300 mb-8">
                            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/20">
                                <Star className="w-4 h-4 fill-current" /> {movie?.rating || "8.5"}
                            </div>
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> {movie?.duration || "145 min"}</span>
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500" /> {movie?.releaseYear}</span>
                            <div className="flex gap-2">
                                {movie?.genre?.map((g: string) => (
                                    <span key={g} className="px-3 py-1 bg-white/10 rounded-lg italic border border-white/5">{g}</span>
                                ))}
                            </div>
                        </div>

                        <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mb-10">
                            {movie?.description}
                        </p>

                        <div className="flex flex-wrap gap-5">
                            <button
                                onClick={() => canWatch && setShowPlayer(true)}
                                className={`flex items-center gap-3 px-10 py-5 ${canWatch ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-800 cursor-not-allowed'} text-white rounded-[2rem] font-black text-xl transition-all transform hover:-translate-y-1`}
                            >
                                <Play className="w-6 h-6 fill-current" /> {canWatch ? "Watch Now" : "Locked"}
                            </button>
                            <button className="flex items-center gap-3 px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] font-black text-xl hover:bg-white/10 transition-all">
                                <Plus className="w-6 h-6" /> Add to List
                            </button>
                        </div>
                    </div>
                </div>

                {/* ৩. স্টোরিলাইন সেকশন */}
                <div className="mt-20 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <h3 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Storyline</h3>
                            <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/5 rounded-[3rem]">
                                <p className="text-gray-400 leading-loose text-lg">
                                    {movie?.description}
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <h3 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Details</h3>
                            <div className="space-y-4 p-8 bg-white/5 border border-white/5 rounded-[3rem]">
                                <div>
                                    <p className="text-xs font-black text-gray-500 uppercase">Director</p>
                                    <p className="text-indigo-400 font-bold">{movie?.director}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-500 uppercase">Cast</p>
                                    <p className="text-gray-300">{movie?.cast?.join(", ")}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-500 uppercase">Platform</p>
                                    <p className="text-gray-300">{movie?.platform?.join(", ")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}