"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, Variants, AnimatePresence, useAnimation } from "framer-motion";
import { Play, Info, Flame, ChevronLeft, ChevronRight, Star, Clock, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";



interface Movie {
    id: string;
    _id?: string;
    title: string;
    description: string;
    backdrop: string;
    backdropUrl?: string;
    isFeatured?: boolean;
    rating?: number;
    duration?: string;
    releaseYear?: string;
}

const fetchFeaturedMovies = async () => {
    const { data } = await axiosInstance.get("/media");
    return data.data.filter((movie: Movie) => movie.isFeatured);
};

// --- Sub-component: Progress Dot ---
const ProgressDot = ({
    isActive,
    onClick,
    duration
}: {
    isActive: boolean;
    onClick: () => void;
    duration: number
}) => {
    return (
        <button
            onClick={onClick}
            className="relative h-1.5 w-12 rounded-full bg-white/10 overflow-hidden group"
        >
            {isActive && (
                <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: duration / 1000, ease: "linear" }}
                    className="absolute inset-0 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                />
            )}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
};

export default function BannerSlider({ initialMedia = [] }: { initialMedia?: any[] }) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const SLIDE_DURATION = 8000; // 8 seconds per slide

    const { data: queryFeatured, isLoading } = useQuery({
        queryKey: ["featuredMovies"],
        queryFn: fetchFeaturedMovies,
        staleTime: 1000 * 60 * 5,
    });

    const featuredMovies = useMemo(() => {
        if (queryFeatured && queryFeatured.length > 0) return queryFeatured;
        const fromInitial = initialMedia.filter(m => m.isFeatured);
        if (fromInitial.length > 0) return fromInitial;
        if (initialMedia.length > 0) return initialMedia.slice(0, 5);
        return [];
    }, [queryFeatured, initialMedia]);

    const nextSlide = useCallback(() => {
        if (!featuredMovies || featuredMovies.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, [featuredMovies]);

    const prevSlide = useCallback(() => {
        if (!featuredMovies || featuredMovies.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
    }, [featuredMovies]);

    useEffect(() => {
        if (!featuredMovies || featuredMovies.length <= 1) return;
        const timer = setInterval(nextSlide, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, [featuredMovies, nextSlide]);

    if (isLoading && featuredMovies.length === 0) {
        return (
            <div className="w-full h-screen bg-[#0d0d0d] flex items-center justify-center">
                <div className="w-[95%] h-[85vh] rounded-[3rem] bg-white/5 animate-pulse" />
            </div>
        );
    }

    if (featuredMovies.length === 0) return null;

    const currentMovie = featuredMovies[currentIndex];
    const backdropUrl = currentMovie.backdropUrl || currentMovie.backdrop || currentMovie.posterUrl || currentMovie.poster;

    // Advanced Animations
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.4 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section className="relative w-full h-[90vh] md:h-screen bg-[#0d0d0d] overflow-hidden flex items-center justify-center pt-20">

            {/* Dynamic Background Overlay */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`bg-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0 z-0 pointer-events-none"
                >
                    <img
                        src={backdropUrl}
                        alt="ambient-bg"
                        className="w-full h-full object-cover blur-[80px] scale-110"
                    />
                    <div className="absolute inset-0 bg-[#0d0d0d]/40" />
                </motion.div>
            </AnimatePresence>

            <div className="container mx-auto px-6 relative z-10 h-full flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        initial={{ opacity: 0, scale: 0.95, rotateY: direction > 0 ? 5 : -5 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 1.05, rotateY: direction < 0 ? 5 : -5 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full h-[70vh] md:h-[80vh] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl shadow-black/80 border border-white/10 group"
                    >
                        {/* Hero Image - High Performance with Smooth Fade-in */}
                        <div className="absolute inset-0">
                            <motion.img
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                src={backdropUrl}
                                alt={currentMovie.title}
                                className="w-full h-full object-cover transition-transform duration-[15s] ease-out group-hover:scale-105"
                            />

                            {/* Sophisticated Gradients for Seamless Blending */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/20 to-transparent hidden md:block" />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>

                        {/* Movie Content with Glassmorphism */}
                        <div className="absolute inset-0 p-8 md:p-20 flex flex-col justify-end md:justify-center">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                key={`content-${currentIndex}`}
                                className="max-w-3xl"
                            >
                                <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mb-8">
                                    <div className="px-4 py-1.5 bg-indigo-500/90 backdrop-blur-xl rounded-full border border-white/20 flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                                        <Flame className="w-3.5 h-3.5 text-white fill-current animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Top Featured</span>
                                    </div>
                                    <div className="px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2">
                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">8.9 Rating</span>
                                    </div>
                                    <div className="px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-gray-300" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">2h 15m</span>
                                    </div>
                                </motion.div>

                                <motion.h1
                                    variants={itemVariants}
                                    className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                                >
                                    {currentMovie.title.split(' ').map((word: any, i: number) => (
                                        <span key={i} className="inline-block mr-4">{word}</span>
                                    ))}
                                </motion.h1>

                                <motion.p
                                    variants={itemVariants}
                                    className="text-gray-200 text-sm md:text-lg font-medium leading-relaxed mb-12 line-clamp-3 max-w-xl opacity-80"
                                >
                                    {currentMovie.description}
                                </motion.p>

                                <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "#6366f1" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push(`/media/${currentMovie.id || currentMovie._id}`)}
                                        className="group/btn flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-indigo-600/30 overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:animate-shimmer" />
                                        <Play className="w-5 h-5 fill-current transition-transform group-hover/btn:scale-110" />
                                        Play Now
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push(`/movie/${currentMovie.id || currentMovie._id}`)}
                                        className="flex items-center gap-3 px-10 py-5 bg-white/5 backdrop-blur-2xl text-white border border-white/10 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all"
                                    >
                                        <Info className="w-5 h-5" />
                                        Details
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Premium Navigation Controls */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-8">
                <button
                    onClick={prevSlide}
                    className="p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500 hover:scale-110 transition-all duration-300"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                    {featuredMovies.map((_: any, index: number) => (
                        <ProgressDot
                            key={index}
                            isActive={index === currentIndex}
                            duration={SLIDE_DURATION}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    className="p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500 hover:scale-110 transition-all duration-300"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Bottom Blending Gradient (Transition into Body) */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0d0d0d] to-transparent z-20 pointer-events-none" />
        </section>
    );
}
