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
            // ১. কুকি থেকে টোকেনটা আগে ধরুন
            const token = Cookies.get("accessToken");

            // ২. টোকেন না থাকলে অযথা এপিআই কল করার দরকার নেই
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                // ৩. টোকেন থাকলে তবেই প্রোফাইল ডাটা আনতে রিকোয়েস্ট পাঠান
                const res = await axiosInstance.get("/auth/me");
                setUser(res.data.data);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    // টোকেন ভুল বা এক্সপায়ার হলে কুকি ক্লিন করে দিন
                    Cookies.remove("accessToken");
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