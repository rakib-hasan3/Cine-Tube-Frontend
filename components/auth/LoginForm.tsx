"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { setUser } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/auth/login", { email, password });

            // তোমার পাঠানো রেসপন্স অনুযায়ী ডাটা ডিস্ট্রাকচারিং
            const { success, data } = res.data;

            if (success && data?.accessToken) {
                // ১. টোকেন সেভ করো (ব্যাকএন্ডে 'accessToken' নামে আসছে)
                localStorage.setItem("token", data.accessToken);

                // ২. সেশন বা রিফ্রেশ টোকেন চাইলে রাখতে পারো (অপশনাল)
                // localStorage.setItem("refreshToken", data.refreshToken);

                // ৩. ইউজার ডাটা কনটেক্সটে সেট করো
                setUser(data.user);

                alert("Login Successful! Welcome " + data.user.name);
                router.push("/");
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <input
                    type="password"
                    required
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