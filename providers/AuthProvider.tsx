"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false); // হাইড্রেশন চেক

    useEffect(() => {
        setIsMounted(true); // যখন ব্রাউজারে মাউন্ট হবে তখন এটি ট্রু হবে

        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await axiosInstance.get("/auth/me");
                // তোমার ব্যাকএন্ডের রেসপন্স ফরম্যাট অনুযায়ী সেট করো
                setUser(res.data.data || res.data.user);
            } catch (err) {
                console.error("Auth verify failed", err);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    // যদি মাউন্ট না হয়, তবে কিছুই রেন্ডার করবে না (সার্ভার-ক্লায়েন্ট ম্যাচ করানোর জন্য)
    if (!isMounted) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);