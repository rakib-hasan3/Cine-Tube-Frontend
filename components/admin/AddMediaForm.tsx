"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { X, Upload, Loader2, Plus, Trash2, Image as ImageIcon, Check } from "lucide-react";
import Swal from "sweetalert2";

const ALL_GENRES = ["ACTION", "DRAMA", "THRILLER", "COMEDY", "ROMANCE"];

const initialFormData = {
    title: "",
    description: "",
    genre: [] as string[],
    releaseYear: 2026,
    director: "",
    cast: [""] as string[],
    platform: ["Web"],
    priceType: "FREE",
    price: 0,
    youtubeLink: "",
    posterUrl: "",
    backdropUrl: "",
    type: "MOVIE"
};

// ১. initialData প্রপস যোগ করা হয়েছে
export default function AddMediaForm({ onClose, initialData }: { onClose: () => void, initialData?: any }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialFormData);

    // ২. এডিট মোড চেক
    const isEditMode = !!initialData;

    // ৩. এডিট মোড হলে ডাটা ফর্মে বসানো
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                // যদি ব্যাকএন্ড থেকে ডাটা স্ট্রিং বা অন্য ফরম্যাটে আসে তা হ্যান্ডেল করা
                genre: initialData.genre || [],
                cast: initialData.cast || [""],
                price: Number(initialData.price || 0)
            });
        }
    }, [initialData]);

    const toggleGenre = (genre: string) => {
        const current = [...formData.genre];
        if (current.includes(genre)) {
            setFormData({ ...formData, genre: current.filter(g => g !== genre) });
        } else {
            setFormData({ ...formData, genre: [...current, genre] });
        }
    };

    const handleCastChange = (index: number, value: string) => {
        const newCast = [...formData.cast];
        newCast[index] = value;
        setFormData({ ...formData, cast: newCast });
    };

    const addCastField = () => setFormData({ ...formData, cast: [...formData.cast, ""] });
    const removeCastField = (index: number) => {
        const newCast = formData.cast.filter((_, i) => i !== index);
        setFormData({ ...formData, cast: newCast });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanGenre = formData.genre.filter(g => g.trim() !== "");
        const cleanCast = formData.cast.filter(c => c.trim() !== "");

        if (cleanGenre.length === 0) return Swal.fire("Error", "Please select at least one genre!", "error");
        if (cleanCast.length === 0) return Swal.fire("Error", "Please add at least one cast member!", "error");

        setLoading(true);
        try {
            // ১. আগে একটি ক্লিন অবজেক্ট তৈরি করুন
            const payload = {
                title: formData.title,
                description: formData.description,
                genre: formData.genre,
                releaseYear: Number(formData.releaseYear),
                director: formData.director,
                cast: formData.cast,
                posterUrl: formData.posterUrl,
                backdropUrl: formData.backdropUrl || "",
                youtubeLink: formData.youtubeLink,
                priceType: formData.priceType,
                type: formData.type,
                // এই লাইনটি সবচেয়ে গুরুত্বপূর্ণ:
                price: formData.priceType === "FREE" ? 0 : Number(formData.price || 0),
            };

            let res;
            if (isEditMode) {
                // ২. এখানে পুরো formData না পাঠিয়ে শুধু payload পাঠান
                res = await axiosInstance.patch(`/media/${initialData.id}`, payload);
            } else {
                res = await axiosInstance.post("/media", payload);
            }

            if (res.data.success) {
                Swal.fire("Success", isEditMode ? "Updated!" : "Added!", "success");
                onClose();
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Something went wrong!";
            Swal.fire("Error", errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-8 md:p-12 animate-in zoom-in duration-300 custom-scrollbar">

                {/* Dynamic Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900">
                            {isEditMode ? "Update" : "Publish"} <span className="text-indigo-600">Media</span>
                        </h2>
                        <p className="text-gray-500 font-medium mt-1">
                            {isEditMode ? "Edit the fields below to update content." : "Fill in the details to add new content."}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Section 1: Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Media Title</label>
                            <input required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                                value={formData.title}
                                placeholder="e.g. Inception"
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea rows={3} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium"
                                value={formData.description}
                                placeholder="Brief story about the media..."
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </div>

                    {/* Section 2: Genres */}
                    <div className="space-y-4">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select Genres</label>
                        <div className="flex flex-wrap gap-2 p-6 bg-gray-50 border border-gray-100 rounded-[2rem]">
                            {ALL_GENRES.map((g) => {
                                const isSelected = formData.genre.includes(g);
                                return (
                                    <button key={g} type="button" onClick={() => toggleGenre(g)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${isSelected ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200" : "bg-white text-gray-500 border-gray-100 hover:border-indigo-200"
                                            }`}>
                                        {isSelected && <Check className="w-3 h-3" />} {g}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 3: Cast */}
                    <div className="space-y-4">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Cast Members (Actors)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {formData.cast.map((c, index) => (
                                <div key={index} className="flex gap-2 animate-in slide-in-from-left-2">
                                    <input required value={c} placeholder={`Actor ${index + 1}`}
                                        className="flex-1 px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-indigo-500 font-bold text-sm"
                                        onChange={(e) => handleCastChange(index, e.target.value)} />
                                    {formData.cast.length > 1 && (
                                        <button type="button" onClick={() => removeCastField(index)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addCastField} className="flex items-center gap-2 text-indigo-600 font-bold text-xs px-4 py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all mt-2">
                            <Plus className="w-4 h-4" /> Add Member
                        </button>
                    </div>

                    {/* Section 4: Visuals & Meta */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 italic">
                                <ImageIcon className="w-4 h-4 text-indigo-500" /> Poster URL
                            </label>
                            <input required value={formData.posterUrl} placeholder="https://..." className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium text-sm"
                                onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 italic">
                                <ImageIcon className="w-4 h-4 text-rose-500" /> Backdrop URL
                            </label>
                            <input value={formData.backdropUrl} placeholder="https://..." className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium text-sm"
                                onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Director</label>
                            <input required value={formData.director} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                                onChange={(e) => setFormData({ ...formData, director: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Release Year</label>
                            <input type="number" value={formData.releaseYear} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                                onChange={(e) => setFormData({ ...formData, releaseYear: Number(e.target.value) })} />
                        </div>
                    </div>

                    {/* Section 5: Pricing & Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price Type</label>
                            <select value={formData.priceType} className="w-full px-6 py-4 bg-gray-900 text-white border-none rounded-2xl font-black"
                                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}>
                                <option value="FREE">FREE</option>
                                <option value="PREMIUM">PREMIUM</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price (BDT)</label>
                            <input type="number" value={formData.price} disabled={formData.priceType === "FREE"} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold disabled:opacity-30"
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Video Link</label>
                            <input required value={formData.youtubeLink} placeholder="YouTube Link" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-medium"
                                onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })} />
                        </div>
                    </div>

                    {/* Final Button */}
                    <div className="pt-6">
                        <button disabled={loading} type="submit"
                            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 active:scale-[0.98] disabled:grayscale">
                            {loading ? <Loader2 className="animate-spin" /> : <Upload className="w-6 h-6" />}
                            {isEditMode ? "Save Changes" : "Publish To Library"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}