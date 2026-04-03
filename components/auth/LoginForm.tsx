"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import Cookies from "js-cookie"; // ✅ ১. ইম্পোর্ট করুন

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { setUser } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/auth/login", { email, password });
            const { success, data } = res.data;

            if (success && data?.accessToken) {
                // ✅ ২. localStorage এ আগের মতোই থাকবে (Client-side usage এর জন্য)
                localStorage.setItem("accessToken", data.accessToken);

                // ✅ ৩. কুকিতে সেভ করুন (Server-side/SEO usage এর জন্য)
                // expires: 7 মানে ৭ দিন পর কুকি অটো ডিলিট হবে
                Cookies.set("accessToken", data.accessToken, { expires: 7, path: '/' });

                // যদি রিফ্রেশ টোকেনও কুকিতে রাখতে চান (অপশনাল)
                if (data.refreshToken) {
                    Cookies.set("refreshToken", data.refreshToken, { expires: 30, path: '/' });
                }

                setUser(data.user);

                alert("Login Successful! Welcome " + data.user.name);

                if (data.user.role === "admin") {
                    router.push("/admin-dashboard");
                } else {
                    router.push("/");
                }
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            alert(err.response?.data?.message || "Login failed!");
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <input
                    type="email"
                    required
                    value={email} // ✅ Controlled input ensures data flow
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300"
                />
            </div>

            <button type="submit" className="w-full py-4.5 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold shadow-xl shadow-gray-200 transition-all active:scale-95 transform duration-200">
                Sign In
            </button>
        </form>
    );
}