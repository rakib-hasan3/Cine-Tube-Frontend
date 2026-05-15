"use client";
import React from "react";
import { motion } from "framer-motion";
import { Clapperboard, Flame, Smartphone, Zap, ChevronRight, Play } from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
    {
        icon: <Clapperboard className="w-6 h-6 text-indigo-500" />,
        title: "Discover Popular & Trending",
        description: "Stay updated with the latest blockbusters and trending titles worldwide."
    },
    {
        icon: <Flame className="w-6 h-6 text-rose-500" />,
        title: "Personalized Continue Watching",
        description: "Never lose your place. Pick up exactly where you left off on any device."
    },
    {
        icon: <Zap className="w-6 h-6 text-amber-500" />,
        title: "Smart Recommendations",
        description: "AI-powered suggestions tailored specifically to your unique viewing habits."
    },
    {
        icon: <Smartphone className="w-6 h-6 text-emerald-500" />,
        title: "Fast & Responsive Experience",
        description: "Optimized streaming that works flawlessly across mobile, tablet, and desktop."
    }
];

export default function AboutSection() {
    const router = useRouter();

    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Column: Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">About CineTube</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-white tracking-tighter">
                            Your Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Streaming</span> Destination.
                        </h2>

                        <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-medium">
                            CineTube is a modern movie streaming platform designed for true cinema lovers. 
                            Discover, explore, and continue watching your favorite movies seamlessly with a 
                            premium experience that rivals the best in the industry.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-8 mb-12">
                            {features.map((feature, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex flex-col gap-3 group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{feature.title}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/media')}
                            className="flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/20"
                        >
                            <Play className="w-6 h-6 fill-current" />
                            Start Watching
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>

                    {/* Right Column: Visual Collage */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "backOut" }}
                        className="relative"
                    >
                        <div className="relative z-10 aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50 group">
                            <img 
                                src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" 
                                alt="Movie Experience" 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                            
                            {/* Floating Card UI Over Image */}
                            <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                        <Play className="w-4 h-4 fill-current ml-1" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-0.5">Now Playing</p>
                                        <p className="text-lg font-black text-white uppercase italic">Inception</p>
                                    </div>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-2/3 h-full bg-indigo-500" />
                                </div>
                            </div>
                        </div>

                        {/* Background Decorative Shapes */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-10" />
                        
                        {/* Smaller Floating Movie Thumbnails */}
                        <motion.div 
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-12 -left-12 w-32 h-44 rounded-2xl overflow-hidden border border-white/10 shadow-2xl hidden md:block"
                        >
                            <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000" className="w-full h-full object-cover" alt="" />
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-12 -right-12 w-40 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-2xl hidden md:block"
                        >
                            <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000" className="w-full h-full object-cover" alt="" />
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
