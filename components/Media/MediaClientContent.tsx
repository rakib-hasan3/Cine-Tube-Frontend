"use client";
import { useState, useEffect, useMemo } from "react";
import { Star, Clapperboard, Lock, Crown, PlayCircle, CheckCircle2, Search } from "lucide-react";
import { useSearchStore } from "@/hooks/useSearchStore";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axios";
import MovieCard from "../Home/MovieCard";

export default function MediaClientContent({ initialMedia }: { initialMedia: any[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialQuery = searchParams.get("searchTerm") || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const { openSearch } = useSearchStore();
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
                    <div className="flex-1">
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
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase truncate max-w-[80vw] md:max-w-[500px] lg:max-w-[700px]">
                            {searchQuery ? <>Results for <span className="text-indigo-500">{searchQuery}</span></> : <>Cine<span className="text-indigo-500">Tube</span> Library</>}
                        </h1>
                    </div>

                    <div className="w-full md:w-auto flex justify-end">
                        <button 
                            onClick={openSearch}
                            className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all group"
                        >
                            <Search className="w-5 h-5 group-hover:text-indigo-500 transition-colors" />
                            <span className="font-bold">Search movies, genres...</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Movie Grid --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {filteredMovies.map((movie: any) => (
                        <MovieCard 
                            key={movie.id || movie._id} 
                            movie={movie} 
                            hasGlobalAccess={hasGlobalAccess}
                            className="w-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}