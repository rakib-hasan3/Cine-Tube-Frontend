"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";

export default function PaymentSuccessClient() {
    const { fetchUser, user } = useAuth() as any; // আপনার AuthProvider এ ইউজার ফেচ করার ফাংশনটি নিন
    const router = useRouter();

    useEffect(() => {
        const syncUser = async () => {
            try {
                // ১. পেমেন্ট সাকসেস হওয়ার পর ব্যাকএন্ড থেকে লেটেস্ট ইউজার ডাটা আনুন
                if (fetchUser) {
                    await fetchUser();
                    toast.success("Subscription updated successfully!");
                }
            } catch (error) {
                console.error("Error syncing user data:", error);
            } finally {
                // ২. অল্প সময় পর হোম পেজে পাঠিয়ে দিন
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            }
        };

        syncUser();
    }, [fetchUser, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold text-emerald-600">Payment Successful!</h1>
            <p className="text-gray-600">Wait a moment, we are updating your profile...</p>
            {/* এখানে একটি সুন্দর সাকসেস এনিমেশন দিতে পারেন */}
        </div>
    );
}