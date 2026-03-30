"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/auth/register", formData);
            if (res.status === 201 || res.status === 200) {
                alert("Registration Successful!");
                router.push("/login");
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Registration failed!");
        }
    };

    return (
        <form onSubmit={handleRegister} className="space-y-5">
            <div>
                <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Full Name</label>
                <input
                    type="text"
                    required
                    placeholder="Rakib Hasan"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 placeholder:text-gray-400"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Email Address</label>
                <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 placeholder:text-gray-400"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Password</label>
                <input
                    type="password"
                    required
                    placeholder="••••••••"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200"
                />
            </div>

            <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 mt-4">
                Create Free Account
            </button>
        </form>
    );
}