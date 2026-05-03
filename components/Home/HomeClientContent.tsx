"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Play, Star, Clapperboard, Monitor, Flame, Ghost, Laugh, Theater, Rocket, Heart, Sword, Lock, Crown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axios";

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
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = Cookies.get("accessToken");
        setIsLoggedIn(!!token);

        if (token) {
            axiosInstance.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUser(res.data.data))
                .catch(err => console.error("User fetch error", err));
        }
    }, []);

    const hasGlobalAccess = useMemo(() => {
        if (!user) return false;
        const now = new Date();
        const expiry = new Date(user.planExpiresAt);
        return user.subscription !== "FREE" && expiry > now;
    }, [user]);

    const handleMovieAction = (movie: any) => {
        const token = Cookies.get("accessToken");
        if (!token) {
            router.push("/login");
            return;
        }
        const isMoviePremium = movie.priceType === "PREMIUM";
        if (isMoviePremium && !hasGlobalAccess) {
            router.push("/pricing");
            return;
        }
        router.push(`/media/${movie.id || movie._id}`);
    };

    const calculateRating = (reviews: any[]) => {
        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return "0.0";
        const total = reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
        return (total / reviews.length).toFixed(1);
    };

    const highRatedMovies = useMemo(() => {
        if (!initialMedia) return [];
        return [...initialMedia]
            .sort((a, b) => parseFloat(calculateRating(b.reviews)) - parseFloat(calculateRating(a.reviews)))
            .slice(0, 5);
    }, [initialMedia]);

    const newArrivals = useMemo(() => {
        if (!initialMedia) return [];
        return [...initialMedia]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
    }, [initialMedia]);

    const categories = useMemo(() => {
        if (!initialMedia) return [];
        const allGenres = initialMedia.flatMap(m => m.genre || []);
        return Array.from(new Set(allGenres));
    }, [initialMedia]);

    return (
        <div className="min-h-screen text-white bg-[#0a0a0a]">
            <section className="relative w-full min-h-[85vh] md:h-[85vh] flex items-center overflow-hidden">

                <div className="absolute inset-0">
                    <img
                        src={featuredMovie.backdrop}
                        alt=""
                        className="w-full h-full object-cover object-center md:object-right"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 md:via-[#0a0a0a]/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                </div>

                <div className="container mx-auto px-5 md:px-12 relative z-10">
                    <div className="max-w-xl md:max-w-4xl mx-auto md:mx-0 text-center md:text-left">

                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-6">
                            <div className="p-1.5 bg-indigo-600 rounded-md">
                                <Clapperboard className="w-3 h-3 md:w-4 md:h-4 text-white" />
                            </div>
                            <span className="text-indigo-400 font-black uppercase tracking-[0.25em] text-[9px] md:text-[10px]">
                                Trending Now
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-7xl font-black leading-tight mb-3 md:mb-6 text-white md:text-transparent md:bg-clip-text md:bg-gradient-to-r from-white to-gray-400 uppercase">
                            {featuredMovie.title}
                        </h1>

                        <p className="max-w-md md:max-w-2xl mx-auto md:mx-0 text-gray-400 text-xs sm:text-sm md:text-lg mb-6 md:mb-10 line-clamp-4 md:line-clamp-3 font-medium">
                            {featuredMovie.description}
                        </p>

                        <div className="flex justify-center md:justify-start">
                            <button
                                onClick={() => router.push('/media')}
                                className="flex items-center gap-3 px-6 py-3 md:px-10 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-bold md:font-black text-sm md:text-xl hover:bg-indigo-500 transition-all shadow-lg md:shadow-2xl shadow-indigo-500/20 active:scale-95"
                            >
                                <Play className="w-4 h-4 md:w-6 md:h-6 fill-current" />
                                {isLoggedIn ? "Explore Library" : "Get Started"}
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 md:px-12">
                <section className="relative z-20 mt-10 md:-mt-32 pb-20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div>
                            <span className="text-indigo-500 font-black uppercase tracking-[0.4em] text-[10px] mb-1 block">Highest Rated</span>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Popular <span className="text-indigo-500">Movies.</span></h2>
                        </div>
                        <Link href="/media" className="w-fit px-6 py-2.5 bg-white/5 hidden md:block border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300">View Library</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                        {highRatedMovies[0] && (
                            <div
                                onClick={() => handleMovieAction(highRatedMovies[0])}
                                className="md:col-span-6 lg:col-span-7 group relative cursor-pointer rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl aspect-[4/5] md:aspect-auto"
                            >
                                <img src={highRatedMovies[0].posterUrl || highRatedMovies[0].poster} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                                {highRatedMovies[0].priceType === "PREMIUM" && (
                                    <div className="absolute top-6 right-6 md:top-8 md:right-8 z-30">
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md ${hasGlobalAccess ? 'bg-indigo-600' : 'bg-amber-500 text-black'}`}>
                                            <Crown className="w-4 h-4 fill-current" />
                                            <span className="text-xs font-black uppercase">{hasGlobalAccess ? "Unlocked" : "Premium"}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 md:p-10 flex flex-col justify-end">
                                    <h3 className="text-3xl md:text-6xl font-black leading-none mb-3 group-hover:text-indigo-400 transition-colors uppercase truncate">{highRatedMovies[0].title}</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="font-black">{calculateRating(highRatedMovies[0].reviews)}</span>
                                        </div>
                                        {!hasGlobalAccess && highRatedMovies[0].priceType === "PREMIUM" && <Lock className="w-4 h-4 text-amber-500" />}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-6 lg:col-span-5 grid grid-cols-2 gap-4 md:gap-6">
                            {highRatedMovies.slice(1, 5).map((movie: any) => (
                                <div key={movie.id} onClick={() => handleMovieAction(movie)} className="group relative cursor-pointer rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 aspect-[3/4] md:aspect-auto">
                                    <img src={movie.posterUrl || movie.poster} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 p-4 md:p-6 flex flex-col justify-end">
                                        {movie.priceType === "PREMIUM" && <Crown className={`w-5 h-5 mb-2 ${hasGlobalAccess ? 'text-indigo-400' : 'text-amber-500'}`} />}
                                        <h4 className="text-sm md:text-lg font-black leading-tight mb-1 line-clamp-2 uppercase">{movie.title}</h4>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-xs font-black">{calculateRating(movie.reviews)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 md:py-24">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-[2px] bg-indigo-600"></div>
                        <span className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px]">New on Cine-Tube</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {newArrivals.map((movie, index) => (
                            <div
                                key={movie.id}
                                onClick={() => handleMovieAction(movie)}
                                className={`group relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-white/10 cursor-pointer bg-white/5 p-4 transition-all duration-500 hover:bg-white/10 ${index === 0 ? 'lg:scale-105' : ''}`}
                            >
                                <div className="relative aspect-video rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-6">
                                    <img src={movie.posterUrl || movie.poster} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                    {movie.priceType === "PREMIUM" && (
                                        <div className="absolute top-4 left-4 bg-amber-500 p-1.5 rounded-full shadow-xl">
                                            <Crown className="w-3 h-3 text-black fill-current" />
                                        </div>
                                    )}
                                </div>
                                <div className="px-4 pb-4">
                                    <h3 className="text-xl md:text-2xl font-black mb-2 group-hover:text-indigo-400 transition-colors uppercase truncate">{movie.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{Array.isArray(movie.genre) ? movie.genre[0] : movie.genre}</span>
                                        {!hasGlobalAccess && movie.priceType === "PREMIUM" && <Lock className="w-4 h-4 text-amber-500" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-12 md:py-24">
                    <div className="flex flex-col mb-12 md:mb-16">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-[2px] bg-indigo-600"></div>
                            <span className="text-indigo-500 font-black uppercase tracking-[0.4em] text-[10px]">
                                Genre Explorer
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                            Find Your{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                                Mood.
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {categories.map((genre: string) => (
                            <Link
                                href={`/media?searchTerm=${genre}`}
                                key={genre}
                                className="group relative"
                            >
                                <div className="relative bg-gradient-to-br from-white/[0.12] via-white/[0.05] to-transparent backdrop-blur-xl rounded-[2rem] p-8 md:p-10 h-full w-full border border-white/10 flex flex-col justify-between transition-all duration-500 group-hover:border-indigo-400/60 group-hover:shadow-[0_10px_50px_rgba(79,70,229,0.25)] group-hover:scale-[1.03] overflow-hidden">

                                    <div className="absolute -right-16 -top-16 w-40 h-40 bg-indigo-500/20 blur-[80px] opacity-60 group-hover:opacity-100 transition-all duration-500" />

                                    <div className="flex flex-col gap-8 relative z-10">

                                        <div className="w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-white group-hover:text-indigo-300 group-hover:bg-indigo-500/20 group-hover:border-indigo-400/40 transition-all duration-500 shadow-inner">
                                            {genreIcons[genre] || <Monitor className="w-6 h-6" />}
                                        </div>

                                        <div>
                                            <h4 className="text-2xl font-extrabold tracking-tight uppercase mb-1 text-white/90 group-hover:text-white transition-colors">
                                                {genre}
                                            </h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                                Explore Movies
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-10 flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                                            <span className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-white transition-colors tracking-wider">
                                                Start Watching
                                            </span>
                                            <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-indigo-400" />
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-4 h-4 fill-indigo-500 text-indigo-500" />
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