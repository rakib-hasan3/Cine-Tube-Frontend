"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X, Clapperboard, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

import { useSearchStore } from "@/hooks/useSearchStore";

export default function SearchModal() {
    const { isSearchModalOpen: isOpen, closeSearch: onClose } = useSearchStore();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            setQuery("");
            setResults([]);
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const res = await axiosInstance.get(`/media?searchTerm=${query}&limit=6`);
                const searchResults = res.data?.data?.data || res.data?.data || (Array.isArray(res.data) ? res.data : []);
                setResults(searchResults);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleResultClick = (id: string) => {
        router.push(`/watch/${id}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-all duration-300"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    >
                        {/* Search Input Area */}
                        <div className="relative p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
                            <Search className="absolute left-10 md:left-12 top-1/2 -translate-y-1/2 w-6 h-6 text-indigo-500" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for movies, genres, or cast..."
                                className="w-full bg-white/5 border border-white/10 outline-none pl-14 md:pl-16 pr-14 py-5 rounded-2xl text-xl font-medium text-white placeholder:text-gray-600 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all duration-300"
                            />
                            <button
                                onClick={onClose}
                                className="absolute right-10 md:right-12 top-1/2 -translate-y-1/2 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-all duration-300 border border-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Results Area */}
                        <div className="max-h-[50vh] overflow-y-auto p-6 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                        <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-indigo-500 animate-pulse" />
                                    </div>
                                    <p className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] animate-pulse">Scanning Archive</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between px-2 mb-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                            Found Results
                                        </p>
                                        <span className="h-px flex-1 mx-4 bg-white/5" />
                                    </div>
                                    {results.map((movie) => (
                                        <button
                                            key={movie.id || movie._id}
                                            onClick={() => handleResultClick(movie.id || movie._id)}
                                            className="group flex items-center gap-5 p-4 hover:bg-white/5 rounded-3xl transition-all duration-300 text-left border border-transparent hover:border-white/5 hover:shadow-xl"
                                        >
                                            <div className="w-24 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/5">
                                                <img
                                                    src={movie.posterUrl || movie.backdropUrl}
                                                    alt={movie.title || movie.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-white text-lg truncate group-hover:text-indigo-400 transition-colors">
                                                    {movie.title || movie.name}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-black text-gray-400 uppercase tracking-widest border border-white/5">
                                                        {Array.isArray(movie.genre) ? movie.genre[0] : movie.genre}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                                    <span className="text-xs font-bold text-indigo-500/70">
                                                        {movie.releaseYear || new Date(movie.createdAt).getFullYear()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-4">
                                                <ChevronRight className="w-5 h-5 text-indigo-500" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : query.length > 1 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                        <Clapperboard className="w-10 h-10 text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
                                    <p className="text-sm text-gray-500 max-w-[280px] mx-auto">We couldn't find anything matching "<span className="text-indigo-400 font-bold">{query}</span>". Try another search.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                                    <div className="relative mb-8">
                                        <Search className="w-16 h-16 text-white/20" />
                                        <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl rounded-full" />
                                    </div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Awaiting Input</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {results.length > 0 && (
                            <div className="p-5 bg-white/[0.03] border-t border-white/5 flex items-center justify-center">
                                <button 
                                    onClick={() => {
                                        router.push(`/media?searchTerm=${query}`);
                                        onClose();
                                    }}
                                    className="px-6 py-2 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:bg-indigo-500/10 hover:text-indigo-300 transition-all duration-300 border border-indigo-500/20"
                                >
                                    Explore all results for "{query}"
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
