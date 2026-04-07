"use client";

import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

interface PricingButtonProps {
    planName: string; // যেমন: "Starter", "Premium", "Family"
    buttonText: string;
    isPopular: boolean;
}

export default function PricingButton({ planName, buttonText, isPopular }: PricingButtonProps) {
    const router = useRouter();
    const auth = useAuth() as any;
    const user = auth?.user;
    console.log("Current User Data from Auth:", user);
    console.log("User Subscription Status:", user?.subscription);
    // ১. আপনার Enum এর সাথে মিল রেখে planValue তৈরি করা
    // যদি planName "Starter" হয়, তবে ওটাকে "FREE" ধরবো, নাহলে ওটাকে সরাসরি বড় হাতের করবো
    const planValue = planName.toLowerCase() === "starter" ? "FREE" : planName.toUpperCase();

    // ২. অ্যাক্টিভ চেক (বড় হাতের ডাটাবেস ভ্যালুর সাথে ম্যাচ করা)
    // নিশ্চিত করছি ইউজার স্ট্যাটাস এবং প্ল্যান ভ্যালু দুটোই বড় হাতের
    const isActive = user?.subscription?.toUpperCase() === planValue;

    const handleSubscribe = async () => {
        // যদি ইউজার অলরেডি এই প্ল্যানে থাকে
        if (isActive) {
            toast.info("You are already on this plan!");
            return;
        }

        try {
            // ৩. স্ট্রিক্টলি চেক করছি যদি ভ্যালু FREE হয়
            if (planValue === "FREE") {
                toast.success("Welcome to Starter Plan!");
                setTimeout(() => {
                    router.push("/");
                }, 1000);
                return;
            }

            // ৪. পেমেন্ট লজিকে যাওয়ার আগে কনফার্মেশন লগ
            console.log("Sending to Backend:", planValue);

            const payload = {
                subscriptionPlan: planValue, // এখানে "PREMIUM" বা "FAMILY" যাবে
                mediaId: null
            };

            const { data } = await axiosInstance.post("/payments/create-session", payload);

            if (data?.data?.checkoutUrl) {
                // পেমেন্ট গেটওয়েতে পাঠিয়ে দেওয়া
                window.location.href = data.data.checkoutUrl;
            } else {
                toast.error("Failed to get payment link");
            }

        } catch (error: any) {
            console.error("Subscription Error:", error?.response?.data || error.message);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <button
            onClick={handleSubscribe}
            // isActive ট্রু হলে বাটন ডিজেবল হবে এবং সবুজ হবে
            disabled={isActive}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg 
                ${isActive
                    ? "bg-emerald-600 text-white cursor-not-allowed opacity-100" // সবুজ কালার
                    : isPopular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 active:scale-95"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900 active:scale-95"
                }`}
        >
            {isActive ? "Current Plan ✓" : buttonText}
        </button>
    );
}