"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface SectionRowProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    viewAllHref?: string;
}

export default function SectionRow({ title, subtitle, children, viewAllHref }: SectionRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section className="py-8 md:py-12 group/section">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
                <div>
                    {subtitle && (
                        <span className="text-indigo-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-1 block">
                            {subtitle}
                        </span>
                    )}
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                        {title}
                    </h2>
                </div>
                
                {viewAllHref && (
                    <Link 
                        href={viewAllHref}
                        className="group flex items-center gap-2 text-xs md:text-sm font-bold text-gray-400 hover:text-white transition-colors"
                    >
                        View All
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                )}
            </div>

            <div className="relative -mx-6 px-6 md:-mx-0 md:px-0">
                {/* Navigation Arrows */}
                {showLeftArrow && (
                    <button 
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-0 bottom-6 z-30 flex items-center justify-center w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent text-white opacity-0 group-hover/section:opacity-100 transition-opacity"
                        aria-label="Scroll left"
                    >
                        <div className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-indigo-600 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                    </button>
                )}

                {showRightArrow && (
                    <button 
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-0 bottom-6 z-30 flex items-center justify-center w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent text-white opacity-100 md:opacity-0 md:group-hover/section:opacity-100 transition-opacity"
                        aria-label="Scroll right"
                    >
                        <div className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-indigo-600 transition-colors">
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </button>
                )}

                <div 
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex gap-4 md:gap-5 overflow-x-auto pb-6 no-scrollbar scroll-smooth"
                >
                    {children}
                </div>
            </div>
        </section>
    );
}
