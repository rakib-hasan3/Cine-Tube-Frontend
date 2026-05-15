"use client";
import React from "react";
import { Play, BookmarkPlus, Star, Calendar, Clock, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MovieCard from "../Home/MovieCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

interface MovieDetailsUIProps {
    movie: any;
    relatedMovies?: any[];
}

export default function MovieDetailsUI({ movie, relatedMovies = [] }: MovieDetailsUIProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: addToWatchlist, isPending: isAdding } = useMutation({
        mutationFn: async () => {
            return await axiosInstance.post(`/watchlist`, {
                mediaId: movie.id || movie._id
            });
        },
        onSuccess: () => {
            toast.success("Added to Watchlist!");
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        },
        onError: () => {
            toast.error("Failed to add to watchlist");
        }
    });

    const calculateRating = (reviews: any[]) => {
        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return "0.0";
        const total = reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
        return (total / reviews.length).toFixed(1);
    };

    const rating = calculateRating(movie.reviews);
    const year = movie.releaseYear || movie.year || new Date(movie.createdAt).getFullYear();
    const duration = movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : "N/A";
    const genres = Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-6 md:px-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold uppercase tracking-widest text-xs">Back to Browse</span>
            </motion.button>

            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-[#141414] rounded-3xl overflow-hidden shadow-2xl border border-white/5"
                >
                    {/* Background Backdrop */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <img 
                            src={movie.backdropUrl || movie.posterUrl} 
                            alt="" 
                            className="w-full h-full object-cover blur-2xl scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row p-6 md:p-12 gap-10">
                        {/* Left: Poster */}
                        <div className="w-full md:w-[350px] flex-shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                            >
                                <img 
                                    src={movie.posterUrl} 
                                    alt={movie.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-black">{rating}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Details */}
                        <div className="flex-1 flex flex-col justify-center space-y-8">
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none italic"
                                >
                                    {movie.title}
                                </motion.h1>
                                
                                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-400">
                                    <div className="flex items-center gap-1.5 text-indigo-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>{year}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>{duration}</span>
                                    </div>
                                    <span className="px-2 py-0.5 bg-white/10 rounded uppercase tracking-widest text-[10px]">
                                        {genres}
                                    </span>
                                    {movie.priceType && (
                                        <span className={`px-2 py-0.5 rounded uppercase tracking-widest text-[10px] font-black ${movie.priceType === 'PREMIUM' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-white'}`}>
                                            {movie.priceType}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-gray-300 text-base md:text-lg leading-relaxed font-medium line-clamp-4 md:line-clamp-none"
                                >
                                    {movie.description || "No description available for this title. Experience the magic of cinema on CineTube."}
                                </motion.p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    {movie.director && (
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Director</span>
                                            <p className="text-sm font-bold text-white">{movie.director}</p>
                                        </div>
                                    )}
                                    {movie.cast && movie.cast.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Starring</span>
                                            <p className="text-sm font-bold text-white line-clamp-1">
                                                {Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                             <div className="flex flex-row items-center gap-3 sm:gap-4 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push(`/watch/${movie.id || movie._id}`)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-4 bg-white text-black rounded-2xl font-black text-sm sm:text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:bg-gray-200"
                                >
                                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                                    Play Now
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addToWatchlist()}
                                    disabled={isAdding}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm sm:text-lg transition-all disabled:opacity-50"
                                >
                                    <BookmarkPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                                    {isAdding ? "Adding..." : "Watchlist"}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Similar Movies Row */}
                {relatedMovies.length > 0 && (
                    <div className="mt-20 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-indigo-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                                    Next for You
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">
                                    Similar <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Movies.</span>
                                </h2>
                            </div>
                        </div>

                        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
                            {relatedMovies.map((item: any) => (
                                <MovieCard 
                                    key={item.id || item._id} 
                                    movie={item} 
                                    className="w-[200px] md:w-[250px]"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
