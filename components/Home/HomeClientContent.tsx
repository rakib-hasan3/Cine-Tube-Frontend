"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Star, Lock, Clapperboard } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// ব্যানার মুভি
const featuredMovie = {
    title: "Avatar: The Way of Water",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    backdrop: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=2000"
};

export default function HomeClientContent({ initialMedia }: { initialMedia: any[] }) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get("accessToken");
        setIsLoggedIn(!!token);
    }, []);

    const handleAction = (movieId?: string) => {
        const token = Cookies.get("accessToken");
        if (!token) {
            router.push("/login");
        } else if (token) {
            router.push(`/media`);
        }
    };

    return (
        <div className="min-h-screen text-white">
            {/* হিরো সেকশন */}
            <section className="relative w-full h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={featuredMovie.backdrop} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-1.5 bg-indigo-600 rounded-md">
                            <Clapperboard className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Trending Now</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {featuredMovie.title.toUpperCase()}
                    </h1>
                    <p className="max-w-2xl text-gray-400 text-lg mb-10 line-clamp-3 font-medium">{featuredMovie.description}</p>

                    <button
                        onClick={() => handleAction()}
                        className="flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95"
                    >
                        <Play className="w-6 h-6 fill-current" /> {isLoggedIn ? "Watch Now" : "Get Started"}
                    </button>
                </div>
            </section>

            {/* পপুলার মুভি গ্রিড - বড় কার্ড ডিজাইন */}
            <section className="relative z-20 -mt-24 px-6 md:px-12 pb-20">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black tracking-tight">
                        Popular <span className="text-indigo-500">Movies</span>
                    </h2>
                    <Link href="/media" className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold hover:bg-white/10 transition">View All</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {initialMedia.slice(0, 8).map((movie: any) => (
                        <div
                            key={movie.id || movie._id}
                            onClick={() => handleAction(movie.id || movie._id)}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:border-indigo-500">
                                <img
                                    src={movie.posterUrl || movie.poster}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={movie.title}
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                                    {!isLoggedIn && (
                                        <div className="flex items-center gap-2 mb-3 bg-indigo-600/90 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                                            <Lock className="w-3 h-3 text-white" />
                                            <span className="text-[10px] font-bold uppercase">Private</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-black">{movie.rating || "8.5"}</span>
                                    </div>
                                    <h3 className="text-2xl font-black leading-tight">{movie.title}</h3>
                                    <p className="text-xs font-bold text-indigo-400 mt-1 uppercase tracking-widest">{movie.year}</p>
                                </div>
                            </div>
                            <div className="mt-6 px-4 text-center sm:text-left">
                                <h4 className="text-lg font-bold text-gray-200 truncate group-hover:text-indigo-500 transition-colors">{movie.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}