"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Play, Star, Clapperboard, Monitor, Flame, Ghost, Laugh, Theater, Rocket, Heart, Sword } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const genreIcons: Record<string, any> = {
    Action: <Sword className="w-6 h-6" />,
    SciFi: <Rocket className="w-6 h-6" />,
    Horror: <Ghost className="w-6 h-6" />,
    Comedy: <Laugh className="w-6 h-6" />,
    Drama: <Theater className="w-6 h-6" />,
    Romance: <Heart className="w-6 h-6" />,
    Animation: <Flame className="w-6 h-6" />,
    Documentary: <Monitor className="w-6 h-6" />,
};

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

    // রেটিং ক্যালকুলেট করার ফাংশন
    const calculateRating = (reviews: any[]) => {
        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return "0.0";
        const total = reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
        return (total / reviews.length).toFixed(1);
    };

    // 🔥 নতুন লজিক: রেটিং অনুযায়ী সেরা ৫টি মুভি খুঁজে বের করা
    const highRatedMovies = useMemo(() => {
        if (!initialMedia) return [];

        return [...initialMedia]
            .sort((a, b) => {
                const ratingA = parseFloat(calculateRating(a.reviews));
                const ratingB = parseFloat(calculateRating(b.reviews));
                return ratingB - ratingA; // বড় থেকে ছোট সাজাবে
            })
            .slice(0, 5); // সেরা ৫টি নিবে
    }, [initialMedia]);

    const categories = useMemo(() => {
        if (!initialMedia) return [];
        const allGenres = initialMedia.flatMap(m => m.genre || []);
        return Array.from(new Set(allGenres));
    }, [initialMedia]);

    const handleAction = (movieId?: string) => {
        const token = Cookies.get("accessToken");
        if (!token) {
            router.push("/login");
        } else if (movieId) {
            router.push(`/media/${movieId}`);
        } else {
            router.push(`/media`);
        }
    };

    // ১. লজিক: একদম লেটেস্ট ৩টি মুভি ফিল্টার করা
    const newArrivals = useMemo(() => {
        if (!initialMedia) return [];
        return [...initialMedia]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3); // লেটেস্ট ৩টি
    }, [initialMedia]);

    return (
        <div className="min-h-screen text-white bg-[#0a0a0a]">
            {/* --- হিরো সেকশন --- */}
            <section className="relative w-full h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={featuredMovie.backdrop} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-1.5 bg-indigo-600 rounded-md">
                                <Clapperboard className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Trending Now</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase">
                            {featuredMovie.title}
                        </h1>
                        <p className="max-w-2xl text-gray-400 text-lg mb-10 line-clamp-3 font-medium">
                            {featuredMovie.description}
                        </p>
                        <button
                            onClick={() => handleAction()}
                            className="flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95"
                        >
                            <Play className="w-6 h-6 fill-current" /> {isLoggedIn ? "Watch Now" : "Get Started"}
                        </button>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 md:px-12">
                {/* --- পপুলার মুভি সেকশন (High Rated Logic applied here) --- */}
                <section className="relative z-20 -mt-32 pb-20">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <span className="text-indigo-500 font-black uppercase tracking-[0.4em] text-[10px] mb-1 block">Highest Rated</span>
                            <h2 className="text-4xl font-black tracking-tight">
                                Popular <span className="text-indigo-500">Movies.</span>
                            </h2>
                        </div>
                        <Link href="/media" className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300">View Library</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                        {/* ১. সবচেয়ে বেশি রেটেড মুভি (বড় কার্ড) */}
                        {highRatedMovies[0] && (
                            <div
                                onClick={() => handleAction(highRatedMovies[0].id)}
                                className="md:col-span-6 lg:col-span-7 group relative cursor-pointer rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
                            >
                                <img
                                    src={highRatedMovies[0].posterUrl || highRatedMovies[0].poster}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    alt="Featured"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                                    <div className="flex items-center gap-2 mb-4 bg-indigo-600 w-fit px-4 py-1 rounded-full">
                                        <Star className="w-3 h-3 text-white fill-current" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Masterpiece</span>
                                    </div>
                                    <h3 className="text-4xl md:text-6xl font-black leading-none mb-3 group-hover:text-indigo-400 transition-colors uppercase">
                                        {highRatedMovies[0].title || highRatedMovies[0].name}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="font-black">{calculateRating(highRatedMovies[0].reviews)}</span>
                                        </div>
                                        <span className="text-gray-400 font-bold">|</span>
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                            {Array.isArray(highRatedMovies[0].genre) ? highRatedMovies[0].genre[0] : highRatedMovies[0].genre}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ২. বাকি ৪টি হাই রেটেড মুভি */}
                        <div className="md:col-span-6 lg:col-span-5 grid grid-cols-2 gap-6">
                            {highRatedMovies.slice(1, 5).map((movie: any) => (
                                <div
                                    key={movie.id}
                                    onClick={() => handleAction(movie.id)}
                                    className="group relative cursor-pointer rounded-[2.5rem] overflow-hidden border border-white/10"
                                >
                                    <img
                                        src={movie.posterUrl || movie.poster}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={movie.title}
                                    />
                                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end text-center md:text-left">
                                        <div className="flex items-center gap-1 text-yellow-400 mb-2 justify-center md:justify-start">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-xs font-black">{calculateRating(movie.reviews)}</span>
                                        </div>
                                        <h4 className="text-lg font-black leading-tight mb-1 line-clamp-2 uppercase">{movie.title || movie.name}</h4>
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                            {movie.releaseYear || movie.year}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* // ২. UI সেকশন (আপনার Genre সেকশনের উপরে বসাতে পারেন) */}
                <section className="py-24 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-[2px] bg-indigo-600"></div>
                        <span className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px]">New on Cine-Tube</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 ml-4 gap-8">
                        {newArrivals.map((movie, index) => (
                            <div
                                key={movie.id}
                                onClick={() => handleAction(movie.id)}
                                className={`group relative overflow-hidden rounded-[3rem] border border-white/10 cursor-pointer bg-white/5 p-4 transition-all duration-500 hover:bg-white/10 ${index === 0 ? 'lg:scale-105 lg:border-indigo-500/50' : ''}`}
                            >
                                <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-6">
                                    <img
                                        src={movie.posterUrl || movie.poster}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={movie.title}
                                    />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase">New</span>
                                    </div>
                                </div>

                                <div className="px-4 pb-4">
                                    <h3 className="text-2xl font-black mb-2 group-hover:text-indigo-400 transition-colors uppercase tracking-tighter truncate">
                                        {movie.title || movie.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            {Array.isArray(movie.genre) ? movie.genre[0] : movie.genre}
                                        </p>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-xs font-black">{calculateRating(movie.reviews)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                {/* Categories সেকশন */}
                <section className="py-24">
                    <div className="flex flex-col mb-16">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-[2px] bg-indigo-600"></div>
                            <span className="text-indigo-500 font-black uppercase tracking-[0.4em] text-[10px]">Genre Explorer</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Mood.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((genre: string) => (
                            <Link
                                href={`/media?searchTerm=${genre}`}
                                key={genre}
                                className="group relative"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-md"></div>
                                <div className="relative bg-[#0f0f0f] rounded-[2.5rem] p-10 h-full w-full border border-white/5 flex flex-col justify-between transition-all duration-500 group-hover:translate-y-[-5px]">
                                    <div className="flex flex-col gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                                            {genreIcons[genre] || <Monitor className="w-7 h-7" />}
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black tracking-tight mb-1 group-hover:text-indigo-400 transition-colors uppercase">{genre}</h4>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{genre} <span className="text-gray-700">Movies</span></p>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 group-hover:text-white transition-colors">Browse Collection</span>
                                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                                            <Play className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}