// app/(common)/(home)/page.tsx
import Link from "next/link";
import { Play, Plus, Star } from "lucide-react"; // আইকনের জন্য lucide-react ব্যবহার করছি

// ডামি ডাটা (পরে ডাটাবেস থেকে আসবে)
const featuredMovie = {
    title: "Avatar: The Way of Water",
    rating: 7.8,
    year: 2023,
    duration: "3h 12m",
    genre: "Sci-Fi / Action",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    backdrop: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=2000" // একটা ডামি ব্যাকগ্রাউন্ড ইমেজ
};

const movies = Array(10).fill({
    id: 1,
    title: "The Witcher",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=400", // ডামি পোস্টার
    rating: 8.5
});

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* 1. Featured Movie Banner (Eye-Catching) */}
            <section className="relative w-full h-[85vh] overflow-hidden group">
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={featuredMovie.backdrop}
                        alt={featuredMovie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                </div>

                {/* Content */}
                <div className="container mx-auto px-6 relative h-full flex flex-col justify-center z-10 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">Featured</span>
                        <div className="flex items-center gap-1.5 text-yellow-400">
                            <Star className="w-5 h-5 fill-yellow-400" />
                            <span className="font-bold text-lg">{featuredMovie.rating}</span>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none max-w-4xl">
                        {featuredMovie.title}
                    </h1>

                    <div className="flex items-center gap-6 mt-6 text-gray-300 font-medium text-sm md:text-base">
                        <span>{featuredMovie.year}</span>
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                        <span>{featuredMovie.duration}</span>
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                        <span className="text-indigo-400">{featuredMovie.genre}</span>
                    </div>

                    <p className="max-w-xl mt-8 text-gray-300 leading-relaxed text-sm md:text-base line-clamp-3">
                        {featuredMovie.description}
                    </p>

                    <div className="flex items-center gap-4 mt-12">
                        <Link
                            href={`/media/${featuredMovie.title.toLowerCase().replace(/ /g, '-')}`}
                            className="flex items-center gap-2.5 px-8 py-4 bg-white text-black rounded-2xl font-bold shadow-xl hover:bg-indigo-50 transition-all active:scale-95 text-lg"
                        >
                            <Play className="w-6 h-6 fill-black" />
                            Watch Now
                        </Link>
                        <button
                            className="flex items-center gap-2.5 px-8 py-4 bg-gray-500/20 backdrop-blur-sm text-white rounded-2xl font-bold border border-gray-500/30 hover:bg-gray-500/40 transition-all text-lg"
                        >
                            <Plus className="w-6 h-6" />
                            Add to Watchlist
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. Trending Media Grid */}
            <section className="container mx-auto px-6 py-20">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                        Trending <span className="text-indigo-600">Now</span>
                    </h2>
                    <Link href="/media" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition">
                        View All →
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                    {movies.map((movie, index) => (
                        <div key={index} className="group flex flex-col gap-3">
                            {/* Card Image */}
                            <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden relative shadow-md group-hover:shadow-2xl group-hover:shadow-indigo-500/20 transition-all duration-300 border border-gray-100">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        <span className="font-bold text-sm text-white">{movie.rating}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Card Title */}
                            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mt-1 group-hover:text-indigo-600 transition-colors">
                                {movie.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}