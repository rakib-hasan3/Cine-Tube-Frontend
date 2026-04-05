"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie"; // js-cookie ইন্সটল করা না থাকলে করে নিয়েন

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // AuthProvider.tsx
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/auth/me");
                setUser(res.data.data);
            } catch (error: any) {
                // যদি ৪০১ এরর দেয়, তার মানে ইউজার লগইন করা নেই
                // এখানে কনসোল এরর না দেখিয়ে শুধু ইউজার নাল করে দিন
                if (error.response?.status === 401) {
                    setUser(null);
                } else {
                    console.error("Auth error:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);