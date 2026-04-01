"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { X, Upload, Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";

export default function AddMediaForm({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: ["Action"],
        releaseYear: new Date().getFullYear(),
        director: "",
        cast: [""],
        platform: ["Web"],
        priceType: "FREE",
        price: 0,
        youtubeLink: "",
        posterUrl: "", // নতুন ফিল্ড
        backdropUrl: "", // নতুন ফিল্ড (ব্যানারের জন্য)
        type: "MOVIE"
    });

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
            // আপনার আপডেট করা ব্যাকএন্ড সার্ভিস অনুযায়ী ডাটা যাবে
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
                <p className="text-gray-500 font-medium mb-10">Add posters and details to publish new content.</p>

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
                            <textarea rows={2} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium"
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </div>

                    {/* Image URLs Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-indigo-500" /> Poster URL (Vertical)
                        </label>
                        <input required placeholder="https://image.com/poster.jpg" className="w-full px-6 py-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium"
                            onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-rose-500" /> Backdrop URL (Horizontal)
                        </label>
                        <input placeholder="https://image.com/banner.jpg" className="w-full px-6 py-4 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none focus:border-rose-500 transition-all font-medium"
                            onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })} />
                    </div>

                    {/* Meta Data */}
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Director</label>
                        <input className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-600"
                            onChange={(e) => setFormData({ ...formData, director: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Release Year</label>
                        <input type="number" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-600"
                            defaultValue={2026} onChange={(e) => setFormData({ ...formData, releaseYear: Number(e.target.value) })} />
                    </div>

                    {/* Pricing & Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Price Type</label>
                        <select className="w-full px-6 py-4 bg-gray-900 text-white border-none rounded-2xl outline-none font-black appearance-none"
                            onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}>
                            <option value="FREE">FREE</option>
                            <option value="PREMIUM">PREMIUM</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Price (BDT)</label>
                        <input type="number" disabled={formData.priceType === "FREE"} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold disabled:opacity-30"
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase">Trailer / Video Link</label>
                        <input required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium"
                            placeholder="Youtube or Video URL" onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })} />
                    </div>

                    {/* Action Button */}
                    <div className="md:col-span-2 pt-6">
                        <button disabled={loading} type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98]">
                            {loading ? <Loader2 className="animate-spin" /> : <Upload className="w-6 h-6" />}
                            Publish Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}