"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { X, Upload, Loader2, Plus, Trash2 } from "lucide-react";

export default function AddMediaForm({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false);

    // তোমার দেওয়া JSON স্ট্রাকচার অনুযায়ী স্টেট
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: ["Action"],
        releaseYear: new Date().getFullYear(),
        director: "",
        cast: [""],
        platform: ["Web"],
        priceType: "FREE", // 'FREE' or 'PREMIUM'
        price: 0,
        youtubeLink: "",
        type: "MOVIE" // 'MOVIE' or 'SERIES'
    });

    // ডাইনামিক ইনপুট হ্যান্ডেল করার জন্য (যেমন: Cast বা Genre লিস্ট)
    const handleArrayInput = (index: number, value: string, field: 'cast' | 'genre') => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayField = (field: 'cast' | 'genre') => {
        setFormData({ ...formData, [field]: [...formData[field], ""] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // তোমার ব্যাকএন্ডে এই ডাটাটাই যাচ্ছে যা তুমি পোস্টম্যান দিয়ে চেক করতে
            const res = await axiosInstance.post("/media", formData);
            if (res.data.success) {
                alert("Boom! Media Added Successfully.");
                onClose();
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 md:p-12 animate-in zoom-in duration-300">
                <h2 className="text-4xl font-black text-gray-900 mb-2">Create <span className="text-indigo-600">Media</span></h2>
                <p className="text-gray-500 font-medium mb-10">Fill in the details to publish new content on CineTube.</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Title & Description */}
                    <div className="space-y-6 md:col-span-2">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase">Media Title</label>
                            <input required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase">Description</label>
                            <textarea rows={3} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium"
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Director</label>
                        <input className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-gray-600"
                            onChange={(e) => setFormData({ ...formData, director: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Release Year</label>
                        <input type="number" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-600"
                            defaultValue={2024} onChange={(e) => setFormData({ ...formData, releaseYear: Number(e.target.value) })} />
                    </div>

                    {/* Cast (Dynamic List) */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Cast Members</label>
                        <div className="grid grid-cols-2 gap-3">
                            {formData.cast.map((c, i) => (
                                <input key={i} className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
                                    placeholder="Actor Name" onChange={(e) => handleArrayInput(i, e.target.value, 'cast')} />
                            ))}
                            <button type="button" onClick={() => addArrayField('cast')} className="flex items-center justify-center p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-all">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Pricing Logic */}
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Price Type</label>
                        <select className="w-full px-6 py-4 bg-indigo-50 border-none rounded-2xl outline-none font-black text-indigo-600 appearance-none"
                            onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}>
                            <option value="FREE">FREE Content</option>
                            <option value="PREMIUM">PREMIUM Content</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Price (BDT)</label>
                        <input type="number" disabled={formData.priceType === "FREE"} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                    </div>

                    {/* Links & Types */}
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Content Type</label>
                        <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                            <option value="MOVIE">Movie</option>
                            <option value="SERIES">TV Series</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Trailer Link</label>
                        <input className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium"
                            placeholder="Youtube URL" onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })} />
                    </div>

                    {/* Action Button */}
                    <div className="md:col-span-2 pt-6">
                        <button disabled={loading} type="submit" className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black text-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98]">
                            {loading ? <Loader2 className="animate-spin" /> : <Upload className="w-6 h-6" />}
                            Confirm & Publish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}