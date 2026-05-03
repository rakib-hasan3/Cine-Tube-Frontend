"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Star, Clapperboard, Lock, Crown, PlayCircle, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axios";

export default function MediaClientContent({ initialMedia }: { initialMedia: any[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialQuery = searchParams.get("searchTerm") || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [user, setUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    }, [initialQuery]);

    // গ্লোবাল এক্সেস চেক লজিক
    const hasGlobalAccess = useMemo(() => {
        if (!user) return false;
        const now = new Date();
        const expiry = new Date(user.planExpiresAt);
        return user.subscription !== "FREE" && expiry > now;
    }, [user]);

    // মুভি ক্লিক লজিক
    const handleMovieClick = (movie: any) => {
        if (!isLoggedIn) {
            router.push("/login");
            return;
        }

        const isPremium = movie.priceType === "PREMIUM";

        // যদি প্রিমিয়াম হয় এবং ইউজারের এক্সেস থাকে অথবা মুভিটা ফ্রি হয়
        if (!isPremium || hasGlobalAccess) {
            router.push(`/media/${movie.id || movie._id}`);
        } else {
            // প্রিমিয়াম মুভি কিন্তু ইউজারের এক্সেস নেই
            router.push("/pricing");
        }
    };

    const calculateRating = (reviews: any[]) => {
        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return "0.0";
        const total = reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
        return (total / reviews.length).toFixed(1);
    };

    const filteredMovies = useMemo(() => {
        return initialMedia.filter((movie: any) => {
            const title = String(movie?.title || movie?.name || "").toLowerCase();
            const genre = Array.isArray(movie?.genre)
                ? movie.genre.join(" ").toLowerCase()
                : String(movie?.genre || "").toLowerCase();
            const search = searchQuery.toLowerCase();
            return title.includes(search) || genre.includes(search);
        });
    }, [searchQuery, initialMedia]);

    return (
        <div className="text-white pb-20">
            {/* --- Header Section --- */}
            <div className="pt-32 pb-12 px-6 md:px-12 bg-gradient-to-b from-indigo-900/20 to-transparent">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-indigo-600 rounded-lg">
                                <Clapperboard className="w-5 h-5 text-white" />
                            </div>
                            {hasGlobalAccess && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Premium Active</span>
                                </div>
                            )}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
                            {searchQuery ? <>Results for <span className="text-indigo-500">{searchQuery}</span></> : <>Cine<span className="text-indigo-500">Tube</span> Library</>}
                        </h1>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search originals..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-12 py-5 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:border-indigo-500/50 font-bold transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* --- Movie Grid --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {filteredMovies.map((movie: any) => {
                        const isPremium = movie.priceType === "PREMIUM";
                        const canWatch = !isPremium || hasGlobalAccess;

                        return (
                            <div key={movie.id || movie._id} onClick={() => handleMovieClick(movie)} className="group cursor-pointer">
                                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:border-indigo-500">
                                    <img src={movie.posterUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                                    {/* Smart Status Badge */}
                                    <div className="absolute top-5 right-5 z-10">
                                        {isPremium ? (
                                            hasGlobalAccess ? (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-full backdrop-blur-md shadow-lg">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">Unlocked</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-black rounded-full backdrop-blur-md shadow-lg">
                                                    <Crown className="w-3 h-3 fill-current" />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">Premium</span>
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white border border-white/20 rounded-full backdrop-blur-md">
                                                <span className="text-[9px] font-black uppercase tracking-tighter">Free</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                                        {canWatch ? (
                                            <div className="flex items-center gap-2 mb-3 bg-emerald-500 w-fit px-3 py-1 rounded-full text-white">
                                                <PlayCircle className="w-3 h-3" />
                                                <span className="text-[10px] font-black uppercase">Watch Now</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 mb-3 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                                                <Lock className="w-3 h-3 text-amber-500" />
                                                <span className="text-[10px] font-black uppercase text-amber-500">Unlock Premium</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-sm font-black">{calculateRating(movie.reviews)}</span>
                                        </div>
                                        <h3 className="text-2xl font-black leading-tight truncate uppercase">{movie.title}</h3>
                                    </div>
                                </div>

                                <div className="mt-6 px-4">
                                    <h4 className="text-lg font-bold text-gray-200 group-hover:text-indigo-400 transition-colors truncate uppercase tracking-tight">
                                        {movie.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 font-bold">{movie.releaseYear}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}