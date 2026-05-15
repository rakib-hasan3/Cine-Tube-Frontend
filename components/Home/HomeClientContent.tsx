"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Play, Star, Clapperboard, Monitor, Flame, Ghost, Laugh, Theater, Rocket, Heart, Sword, Lock, Crown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axios";
import ContinueWatchingSection from "./ContinueWatchingSection";
import MovieCard from "./MovieCard";
import SectionRow from "./SectionRow";
import AboutSection from "./AboutSection";
import FAQSection from "./FAQSection";
import BannerSlider from "./BannerSlider";
import ContactSection from "./ContactSection";

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

    const calculateRating = (reviews: any[]) => {
        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return "0.0";
        const total = reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
        return (total / reviews.length).toFixed(1);
    };

    const highRatedMovies = useMemo(() => {
        if (!initialMedia) return [];
        return [...initialMedia]
            .sort((a, b) => parseFloat(calculateRating(b.reviews)) - parseFloat(calculateRating(a.reviews)));
    }, [initialMedia]);

    const newArrivals = useMemo(() => {
        if (!initialMedia) return [];
        return [...initialMedia]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [initialMedia]);

    const categories = useMemo(() => {
        if (!initialMedia) return [];
        const allGenres = initialMedia.flatMap(m => m.genre || []);
        return Array.from(new Set(allGenres));
    }, [initialMedia]);

    return (
        <div className="min-h-screen text-white bg-[#0d0d0d] pb-20">
            <BannerSlider initialMedia={initialMedia} />

            <div className="container mx-auto px-6 md:px-12 mt-10 md:mt-20 relative z-20">
                {/* Continue Watching */}
                {isLoggedIn && <ContinueWatchingSection />}

                {/* Trending Now */}
                <SectionRow
                    title="Trending Now"
                    subtitle="Highest Rated"
                    viewAllHref="/media"
                >
                    {highRatedMovies.slice(0, 10).map((movie) => (
                        <MovieCard
                            key={movie.id || movie._id}
                            movie={movie}
                            hasGlobalAccess={hasGlobalAccess}
                        />
                    ))}
                </SectionRow>

                {/* New Arrivals */}
                <SectionRow
                    title="New on CineTube"
                    subtitle="Recently Added"
                    viewAllHref="/media"
                >
                    {newArrivals.slice(0, 10).map((movie) => (
                        <MovieCard
                            key={movie.id || movie._id}
                            movie={movie}
                            hasGlobalAccess={hasGlobalAccess}
                        />
                    ))}
                </SectionRow>

                {/* About CineTube Section */}
                <AboutSection />

                {/* FAQ Section */}
                <FAQSection />

                {/* Contact Us Section */}
                <ContactSection />

                {/* Genre Explorer */}
                <section className="py-12 md:py-20">
                    <div className="flex flex-col mb-10">
                        <span className="text-indigo-500 font-bold uppercase tracking-[0.3em] text-xs mb-1 block">
                            Genre Explorer
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white">
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Mood.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((genre: string) => (
                            <Link
                                href={`/media?searchTerm=${genre}`}
                                key={genre}
                                className="group relative h-48 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-500 hover:border-indigo-500/50 hover:bg-white/10"
                            >
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />

                                <div className="relative z-10 flex h-full flex-col justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all duration-500">
                                        {genreIcons[genre] || <Monitor className="w-6 h-6" />}
                                    </div>

                                    <div>
                                        <h4 className="text-2xl font-bold text-white mb-1">{genre}</h4>
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-indigo-400 transition-colors">
                                            Explore <ChevronRight className="w-3 h-3" />
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
