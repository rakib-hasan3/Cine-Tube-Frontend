"use client";
import React from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Play, Info, Flame } from "lucide-react";
import { useRouter } from "next/navigation";

interface BannerProps {
    movie: {
        title: string;
        description: string;
        backdrop: string;
    };
    isLoggedIn: boolean;
}

export default function Banner({ movie, isLoggedIn }: BannerProps) {
    const router = useRouter();
    const { scrollY } = useScroll();
    
    // Parallax and fading effects on scroll
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        },
    };

    return (
        <section className="relative w-full h-[80vh] md:h-[95vh] flex items-center overflow-hidden bg-black">
            {/* Infinite Ken Burns Background */}
            <motion.div 
                style={{ y: y1 }}
                className="absolute -top-[5%] left-0 w-full h-[110%] z-0"
            >
                <motion.img
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ 
                        scale: [1.05, 1.15, 1.05],
                        opacity: 1
                    }}
                    transition={{ 
                        scale: {
                            duration: 30,
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        opacity: {
                            duration: 1.5,
                            ease: "easeOut"
                        }
                    }}
                    src={movie.backdrop}
                    alt={movie.title}
                    className="w-full h-full object-cover object-center"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                
                {/* Subtle Moving Light Effect */}
                <motion.div 
                    animate={{ 
                        opacity: [0.1, 0.15, 0.1],
                        x: ['-5%', '5%', '-5%']
                    }}
                    transition={{ 
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none"
                />
            </motion.div>

            {/* Content Container (Stable) */}
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ opacity }}
                    className="max-w-3xl"
                >
                    {/* Trending Badge */}
                    <motion.div 
                        variants={itemVariants}
                        className="flex items-center gap-2 mb-6"
                    >
                        <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20">
                            <Flame className="w-4 h-4 text-white fill-current" />
                        </div>
                        <span className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs">
                            Trending Now
                        </span>
                    </motion.div>

                    {/* Movie Title */}
                    <motion.h1 
                        variants={itemVariants}
                        className="text-5xl sm:text-6xl md:text-8xl font-black leading-none mb-6 text-white uppercase tracking-tighter"
                    >
                        {movie.title}
                    </motion.h1>

                    {/* Description */}
                    <motion.p 
                        variants={itemVariants}
                        className="max-w-2xl text-gray-300 text-sm md:text-xl mb-10 line-clamp-3 font-medium leading-relaxed"
                    >
                        {movie.description}
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-wrap gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/media')}
                            className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-bold text-lg transition-all"
                        >
                            <Play className="w-6 h-6 fill-current" />
                            {isLoggedIn ? "Watch Now" : "Get Started"}
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/media')}
                            className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold text-lg transition-all"
                        >
                            <Info className="w-6 h-6" />
                            More Info
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Fade Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        </section>
    );
}
