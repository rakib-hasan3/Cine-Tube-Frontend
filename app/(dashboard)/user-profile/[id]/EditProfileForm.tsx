"use client";
import React, { useState } from "react";
import { Camera, User, Mail, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function EditProfileForm({ initialData }: { initialData: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        email: initialData?.email || "",
        avatar: initialData?.avatar || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // ✅ শুধু প্রয়োজনীয় ডাটা ফিল্টার করে পাঠাচ্ছি
            const updateData = {
                name: formData.name,
            };

            const res = await axiosInstance.patch(
                `/users/${initialData.id}`,
                updateData // এখানে ইমেইল বা আইডি বডিতে পাঠাবেন না
            );

            if (res.data.success) {
                alert("Profile updated successfully!");
                router.push("/user-profile");
                router.refresh();
            }
        } catch (error: any) {
            console.log("Error Response:", error.response?.data); // টার্মিনালে চেক করুন কী এরর দিচ্ছে
            alert(error.response?.data?.message || "Update failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* অ্যাভাটার এডিট সেকশন */}
            <div className="flex flex-col items-center gap-4 mb-10">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white/5 bg-[#111] shadow-2xl">
                        <img
                            src={formData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <label className="absolute bottom-0 right-0 p-3 bg-indigo-600 rounded-2xl cursor-pointer hover:bg-indigo-500 transition-all shadow-xl">
                        <Camera className="w-5 h-5 text-white" />
                        <input type="file" className="hidden" /> {/* ফাইল আপলোড লজিক পরে অ্যাড করা যাবে */}
                    </label>
                </div>
            </div>

            {/* ইনপুট ফিল্ডস */}
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                        <User className="w-3 h-3" /> Full Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-600"
                    />
                </div>

                <div className="space-y-2 opacity-50 cursor-not-allowed">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Email Address (Non-editable)
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 outline-none"
                    />
                </div>
            </div>

            {/* বাটনস */}
            <div className="flex items-center gap-4 pt-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" /> Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? "Updating..." : <><Save className="w-5 h-5" /> Save Changes</>}
                </button>
            </div>
        </form>
    );
}