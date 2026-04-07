"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Star, Clapperboard, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function MediaClientContent({ initialMedia }: { initialMedia: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // সরাসরি localStorage চেক
        const token = Cookies.get("accessToken");
        setIsLoggedIn(!!token);
    }, []);


    const filteredMovies = useMemo(() => {
        return initialMedia.filter((movie: any) => {
            const title = String(movie?.title || "").toLowerCase();
            const genre = Array.isArray(movie?.genre)
                ? movie.genre.join(" ").toLowerCase()
                : String(movie?.genre || "").toLowerCase();
            const search = searchQuery.toLowerCase();
            return title.includes(search) || genre.includes(search);
        });
    }, [searchQuery, initialMedia]);

    const handleMovieClick = (movieId: string) => {
        if (!Cookies.get("accessToken")) {
            router.push("/login");
        } else {
            router.push(`/media/${movieId}`);
        }
    };

    return (
        <div className="text-white pb-20">
            {/* সার্চ সেকশন */}
            <div className="pt-32 pb-12 px-6 md:px-12 bg-gradient-to-b from-indigo-900/20 to-transparent">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-600 rounded-lg">
                                <Clapperboard className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Library</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Explore <span className="text-indigo-500">Movies.</span></h1>
                    </div>
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:border-indigo-500/50 transition-all font-bold"
                        />
                    </div>
                </div>
            </div>

            {/* মুভি গ্রিড - কার্ড সাইজ বড় করা হয়েছে */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {/* গ্রিড কলাম কমিয়ে কার্ড সাইজ বাড়ানো হয়েছে (gap-10) */}
                    {filteredMovies.map((movie: any) => (
                        <div
                            key={movie.id || movie._id}
                            onClick={() => handleMovieClick(movie.id || movie._id)}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:border-indigo-500">
                                <img
                                    src={movie.posterUrl || movie.poster}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                                    {!isLoggedIn && (
                                        <div className="flex items-center gap-2 mb-3 bg-indigo-600/80 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                                            <Lock className="w-3 h-3 text-white" />
                                            <span className="text-[10px] font-bold uppercase">Locked</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-black">{movie.rating || "8.0"}</span>
                                    </div>
                                    <h3 className="text-2xl font-black leading-tight mb-1">{movie.title}</h3>
                                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                        {Array.isArray(movie.genre) ? movie.genre[0] : movie.genre}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 px-4">
                                <h4 className="text-lg font-bold text-gray-200 group-hover:text-indigo-400 transition-colors truncate">{movie.title}</h4>
                                <p className="text-sm text-gray-500 font-bold">{movie.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}