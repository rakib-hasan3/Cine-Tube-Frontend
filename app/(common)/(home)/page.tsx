import Link from "next/link";
import { Play, Plus, Star, Info } from "lucide-react";

// ডামি ডাটা (পরে ডাটাবেস থেকে আসবে)
const featuredMovie = {
    title: "Avatar: The Way of Water",
    rating: 7.8,
    year: 2023,
    duration: "3h 12m",
    genre: "Sci-Fi / Action",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    backdrop: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=2000"
};

const movies = Array(12).fill({
    id: 1,
    title: "The Witcher",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=400",
    rating: 8.5
});

export default function HomePage() {
    return (
        // ১. ব্যাকগ্রাউন্ড ডার্ক করে প্রিমিয়াম ভাইব আনা হয়েছে
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            {/* ২. Featured Hero Section */}
            <section className="relative w-full h-[90vh] flex items-center overflow-hidden">
                {/* Background with Cinematic Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={featuredMovie.backdrop}
                        alt={featuredMovie.title}
                        className="w-full h-full object-cover"
                    />
                    {/* লেয়ারড গ্রেডিয়েন্ট যা টেক্সটকে ফুটিয়ে তুলবে */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="flex items-center gap-3 mb-6 animate-pulse">
                        <span className="px-4 py-1.5 bg-indigo-600 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/40">Trending Now</span>
                        <div className="flex items-center gap-1 text-yellow-500 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-bold">{featuredMovie.rating}</span>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
                        AVATAR: <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">THE WAY OF WATER</span>
                    </h1>

                    <div className="flex items-center gap-4 text-gray-400 font-bold text-sm mb-8">
                        <span className="text-white bg-white/10 px-2 py-0.5 rounded italic">4K Ultra HD</span>
                        <span>{featuredMovie.year}</span>
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        <span>{featuredMovie.duration}</span>
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        <span className="text-indigo-400">{featuredMovie.genre}</span>
                    </div>

                    <p className="max-w-2xl text-gray-300 text-lg leading-relaxed mb-10 line-clamp-3">
                        {featuredMovie.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-5">
                        <button className="flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-indigo-500 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-2xl">
                            <Play className="w-6 h-6 fill-current" /> Play Now
                        </button>
                        <button className="flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-2xl font-black text-xl hover:bg-white/20 transition-all active:scale-95">
                            <Plus className="w-6 h-6" /> My List
                        </button>
                    </div>
                </div>
            </section>

            {/* ৩. Trending Media Row (Horizontal Scrollable feeling) */}
            <section className="relative z-20 -mt-32 px-6 md:px-12 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        Popular <span className="text-indigo-500">Movies</span>
                    </h2>
                    <Link href="/movies" className="text-sm font-bold text-gray-400 hover:text-white transition">Explore All</Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {movies.map((movie, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-indigo-500/50">
                                <img src={movie.poster} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                    <div className="flex items-center gap-1 text-yellow-400 mb-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs font-bold">{movie.rating}</span>
                                    </div>
                                    <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">Details</button>
                                </div>
                            </div>
                            <h3 className="text-sm font-bold mt-3 text-gray-300 group-hover:text-white truncate">{movie.title}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}