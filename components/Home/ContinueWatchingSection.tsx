"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import MovieCard from "./MovieCard";
import SectionRow from "./SectionRow";
import Cookies from "js-cookie";

export default function ContinueWatchingSection() {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchContinueWatching = async () => {
            try {
                const res = await axiosInstance.get("/continue-watching");
                setMovies(res.data.data || []);
            } catch (error) {
                console.error("Error fetching continue watching:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContinueWatching();
    }, []);

    if (loading || movies.length === 0) return null;

    return (
        <SectionRow 
            title="Continue Watching" 
            subtitle="Pick up where you left off"
        >
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    isContinueWatching={true}
                    hasGlobalAccess={true} // Usually if they can watch it, they have access
                />
            ))}
        </SectionRow>
    );
}
