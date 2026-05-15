"use client";
import React from "react";
import { Play, Star, Info, Calendar, Crown, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface MovieCardProps {
    movie: any;
    isContinueWatching?: boolean;
    hasGlobalAccess?: boolean;
    className?: string;
}

export default function MovieCard({ 
    movie, 
    isContinueWatching = false, 
    hasGlobalAccess = false,
    className = "",
}: MovieCardProps) {
    const router = useRouter();

    // Handle nested media object for continue watching or flat object for others
    const media = isContinueWatching ? movie.media : movie;
    const movieId = isContinueWatching ? movie.movieId : (movie.id || movie._id);
    const posterUrl = media.posterUrl || media.poster;
    
    const calculateRating = (reviews: any[]) => {
        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return "0.0";
        const total = reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
        return (total / reviews.length).toFixed(1);
    };

    const rating = calculateRating(media.reviews);
    const year = media.releaseYear || media.year || (media.createdAt ? new Date(media.createdAt).getFullYear() : "N/A");
    const isPremium = media.priceType === "PREMIUM";
    const canWatch = !isPremium || hasGlobalAccess;

    const handleNavigateDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/movie/${movieId}`);
    };

    const handleNavigateWatch = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPremium && !hasGlobalAccess) {
            router.push("/pricing");
        } else {
            router.push(`/watch/${movieId}`);
        }
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`group relative flex-none aspect-[2/3] rounded-2xl overflow-hidden bg-[#141414] cursor-pointer shadow-lg hover:shadow-indigo-500/20 ${className || "w-[160px] sm:w-[200px] md:w-[240px]"}`}
            onClick={handleNavigateDetails}
        >
            {/* Poster Image */}
            <img
                src={posterUrl}
                alt={media.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
            />

            {/* Default View: Info at bottom */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
                <h4 className="text-sm md:text-base font-bold text-white line-clamp-1 group-hover:opacity-0 transition-opacity duration-300">
                    {media.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 group-hover:opacity-0 transition-opacity duration-300">
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold">{rating}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{year}</span>
                </div>
            </div>

            {/* Hover Interaction: Premium Overlay */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
                {/* Top Badge */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-black text-white">{rating}</span>
                    </div>
                    {isPremium && (
                        <div className={`px-2 py-1 rounded-lg flex items-center gap-1.5 backdrop-blur-md border ${hasGlobalAccess ? 'bg-indigo-600/50 border-indigo-500/50' : 'bg-amber-500/50 border-amber-400/50'}`}>
                            <Crown className={`w-3 h-3 ${hasGlobalAccess ? 'text-white' : 'text-amber-300'} fill-current`} />
                            <span className="text-[10px] font-black uppercase text-white">
                                {hasGlobalAccess ? "Active" : "Premium"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="space-y-1">
                        <h4 className="text-base md:text-lg font-black text-white leading-tight drop-shadow-lg line-clamp-2">
                            {media.title}
                        </h4>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-bold">
                                {year}
                            </span>
                            {media.genre && (
                                <span className="text-[10px] text-indigo-400 font-bold truncate">
                                    {Array.isArray(media.genre) ? media.genre[0] : media.genre}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <button 
                            onClick={handleNavigateWatch}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-black rounded-xl font-bold text-xs hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        >
                            {!canWatch ? <Lock className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                            {!canWatch ? "Unlock" : (isContinueWatching ? "Resume" : "Play")}
                        </button>
                        <button 
                            onClick={handleNavigateDetails}
                            className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl text-white transition-all active:scale-95"
                        >
                            <Info className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar for Continue Watching */}
            {isContinueWatching && (
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/10 z-20">
                    <div
                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all duration-500"
                        style={{ width: `${Math.min((movie.currentTime / (media.duration || 1)) * 100, 100)}%` }}
                    />
                </div>
            )}
        </motion.div>
    );
}
