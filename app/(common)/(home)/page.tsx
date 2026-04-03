"use client";
import Link from "next/link";
import { Play, Plus, Star, Loader2, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie"; // কুকি থেকে টোকেন চেক করার জন্য
import { useRouter } from "next/navigation";

// ব্যানার স্ট্যাটিকই থাকলো
const featuredMovie = {
    title: "Avatar: The Way of Water",
    rating: 7.8,
    year: 2023,
    duration: "3h 12m",
    genre: "Sci-Fi / Action",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora...",
    backdrop: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=2000"
};

export default function HomePage() {
    const router = useRouter();

    // ১. লগইন চেক করার লজিক
    const token = Cookies.get("accessToken"); // অথবা localStorage.getItem("accessToken")
    const isLoggedIn = !!token;

    const { data: media, isLoading } = useQuery({
        queryKey: ["popular-movies"],
        queryFn: async () => {
            const res = await axiosInstance.get("/media");
            return res.data.data;
        }
    });

    // ২. হ্যান্ডেল ক্লিক লজিক
    const handleDetailsClick = (movieId: string) => {
        if (!isLoggedIn) {
            // লগইন না থাকলে লগইন পেজে পাঠাবে
            router.push("/login");
        } else {
            // লগইন থাকলে ডিটেইলস পেজে যাবে
            router.push(`/media/${movieId}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* হিরো সেকশন */}
            <section className="relative w-full h-[90vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={featuredMovie.backdrop} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <h1 className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                        {featuredMovie.title.toUpperCase()}
                    </h1>
                    <p className="max-w-2xl text-gray-300 text-lg leading-relaxed mb-10 line-clamp-3">{featuredMovie.description}</p>
                    <div className="flex flex-wrap items-center gap-5">
                        <button
                            onClick={() => isLoggedIn ? router.push('/media/featured-id') : router.push('/login')}
                            className="flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-indigo-500 hover:text-white transition-all shadow-xl"
                        >
                            <Play className="w-6 h-6 fill-current" /> {isLoggedIn ? "Play Now" : "Login to Watch"}
                        </button>
                    </div>
                </div>
            </section>

            {/* ডাইনামিক মুভি সেকশন */}
            <section className="relative z-20 -mt-32 px-6 md:px-12 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        Popular <span className="text-indigo-500">Movies</span>
                    </h2>
                    <Link href="/media" className="text-sm font-bold text-gray-400 hover:text-white transition">Explore All</Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {media?.data.map((movie: any) => (
                            <div key={movie.id} className="group cursor-pointer">
                                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-indigo-500/50">
                                    <img src={movie.posterUrl} className="w-full h-full object-cover" alt={movie.title} />

                                    {/* কার্ডের ওপরের ওভারলে */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                        <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-xs font-bold">{movie.rating}</span>
                                        </div>

                                        {/* ৩. কন্ডিশনাল বাটন */}
                                        <button
                                            onClick={() => handleDetailsClick(movie.id)}
                                            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {!isLoggedIn && <Lock className="w-3 h-3" />}
                                            {isLoggedIn ? "Details" : "Login to View"}
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold mt-3 text-gray-400 group-hover:text-white transition-colors truncate">{movie.title}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}