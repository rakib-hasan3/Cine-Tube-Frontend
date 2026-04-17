"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Save, Loader2, Globe, Shield, Mail, Banknote } from "lucide-react";
import Swal from "sweetalert2";

export default function DynamicAdminSettings() {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [settings, setSettings] = useState({
        siteName: "",
        siteEmail: "",
        maintenanceMode: false,
        allowRegistration: true,
        premiumMonthlyFee: 0
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axiosInstance.get("/admin/settings");
                if (res.data?.data) {
                    // ব্যাকএন্ড থেকে আসা ডাটার সাথে ডিফল্ট স্টেট মার্জ করা
                    setSettings({
                        siteName: res.data.data.siteName || "",
                        siteEmail: res.data.data.siteEmail || "",
                        maintenanceMode: res.data.data.maintenanceMode ?? false,
                        allowRegistration: res.data.data.allowRegistration ?? true,
                        premiumMonthlyFee: res.data.data.premiumMonthlyFee || 0
                    });
                }
            } catch (err) {
                console.error("Failed to load settings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await axiosInstance.patch("/admin/settings", settings);
            Swal.fire({
                icon: 'success',
                title: 'Engine Updated',
                text: 'System configurations applied successfully!',
                confirmButtonColor: '#4f46e5',
            });
        } catch (err) {
            Swal.fire("Error", "Update failed. Check backend connection.", "error");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="font-black text-gray-400 uppercase tracking-widest">Accessing Engine...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight text-center md:text-left">
                        System <span className="text-indigo-600">Config</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Manage global behavior and platform identity.</p>
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                    {updating ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                    Update Engine
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Branding Card */}
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-black flex items-center gap-3 text-gray-800">
                        <div className="p-2 bg-indigo-50 rounded-xl"><Globe className="w-5 h-5 text-indigo-600" /></div>
                        Branding & Support
                    </h3>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Platform Display Name</label>
                            <input
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-indigo-500 focus:bg-white transition-all font-bold outline-none ring-0"
                                placeholder="e.g. CineTube"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <input
                                    value={settings.siteEmail}
                                    onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-indigo-500 focus:bg-white transition-all font-bold outline-none ring-0"
                                    placeholder="support@cinetube.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Maintenance Card */}
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-black flex items-center gap-3 text-gray-800">
                        <div className="p-2 bg-rose-50 rounded-xl"><Shield className="w-5 h-5 text-rose-500" /></div>
                        Safety & Access
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem]">
                            <div>
                                <p className="font-black text-gray-800">Maintenance Mode</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Admin Only Access</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                className={`w-14 h-8 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-rose-500' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${settings.maintenanceMode ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem]">
                            <div>
                                <p className="font-black text-gray-800">Public Registration</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Open for new users</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                                className={`w-14 h-8 rounded-full transition-all relative ${settings.allowRegistration ? 'bg-emerald-500' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${settings.allowRegistration ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subscription Card */}
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-50 rounded-xl"><Banknote className="w-5 h-5 text-amber-600" /></div>
                        <h3 className="text-xl font-black text-gray-800">Premium Pricing</h3>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Monthly Fee (USD)
                            </label>
                            <input
                                type="number"
                                // যদি ভ্যালু 0 হয়, তবে ইনপুট বক্স খালি দেখাবে (প্লেসহোল্ডার দেখানোর জন্য)
                                value={settings.premiumMonthlyFee === 0 ? "" : settings.premiumMonthlyFee}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // যদি ইনপুট খালি করে দেয় তবে ০ সেট হবে, নাহলে নতুন নাম্বার
                                    setSettings({
                                        ...settings,
                                        premiumMonthlyFee: val === "" ? 0 : Number(val)
                                    });
                                }}
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-amber-500 focus:bg-white transition-all font-black text-3xl text-amber-600 outline-none ring-0"
                                placeholder="0"
                            />
                        </div> </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

                        <div className="p-6 bg-amber-50/50 rounded-[2rem] border border-dashed border-amber-200">
                            <p className="text-sm font-bold text-amber-900 leading-relaxed italic">
                                "Updating this value will change the subscription cost for all future premium members immediately."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}