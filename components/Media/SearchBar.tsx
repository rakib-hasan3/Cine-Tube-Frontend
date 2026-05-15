"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, X, Clapperboard, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchBarProps {
    onSearch: (query: string) => void;
    initialValue?: string;
    allMedia?: any[];
}

export default function SearchBar({ onSearch, initialValue = "", allMedia = [] }: SearchBarProps) {
    const [query, setQuery] = useState(initialValue);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (query.trim().length > 1) {
            const filtered = allMedia.filter(m => 
                m.title.toLowerCase().includes(query.toLowerCase()) ||
                (Array.isArray(m.genre) ? m.genre.join(" ").toLowerCase().includes(query.toLowerCase()) : m.genre?.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
        onSearch(query);
    }, [query, allMedia]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClear = () => {
        setQuery("");
        onSearch("");
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (movieId: string) => {
        router.push(`/movie/${movieId}`);
        setShowSuggestions(false);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-50">
            <div className="relative group">
                {/* Search Icon */}
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                    <Search className="w-5 h-5" />
                </div>

                {/* Input Field */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setShowSuggestions(true)}
                    placeholder="Search movies, genres, originals..."
                    className="w-full pl-14 pr-12 py-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 font-bold transition-all placeholder:text-gray-600"
                />

                {/* Clear Button */}
                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleClear}
                            className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full text-gray-500 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute top-full left-0 right-0 mt-4 bg-[#141414]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl z-[60]"
                    >
                        <div className="p-2">
                            <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5 mb-2">
                                Suggestions
                            </div>
                            {suggestions.map((item) => (
                                <button
                                    key={item.id || item._id}
                                    onClick={() => handleSuggestionClick(item.id || item._id)}
                                    className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-all group/item text-left"
                                >
                                    <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                                        <img 
                                            src={item.posterUrl || item.backdropUrl} 
                                            alt="" 
                                            className="w-full h-full object-cover transition-transform group-hover/item:scale-110"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white truncate text-sm">
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                                                {Array.isArray(item.genre) ? item.genre[0] : item.genre}
                                            </span>
                                            <span className="text-[10px] text-gray-600 font-bold">
                                                {item.releaseYear || new Date(item.createdAt).getFullYear()}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-700 group-hover/item:text-white transition-all transform group-hover/item:translate-x-1" />
                                </button>
                            ))}
                            <button 
                                onClick={() => setShowSuggestions(false)}
                                className="w-full p-4 text-center text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors border-t border-white/5 mt-2"
                            >
                                View All Results
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
