import WatchlistClient from "@/components/Watchlist/WatchlistClient";
import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers"; // সার্ভার সাইড কুকি
import { redirect } from "next/navigation";

export const metadata = {
    title: "My Watchlist | CineTube",
    description: "View and manage your favorite movies in CineTube watchlist.",
};

export default async function WatchlistPage() {
    // ১. কুকি থেকে টোকেন নিন (সার্ভার সাইড মেথড)
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value; // আপনার কুকি নাম 'accessToken' হলে

    // ২. রিডাইরেক্ট চেক (try-catch এর বাইরে রাখতে হবে)
    if (!token) {
        redirect("/login");
    }

    let watchlistData = [];

    try {
        // ৩. টোকেন সহ ডাটা ফেচ করুন
        const res = await axiosInstance.get("/watchlist", {
            headers: {
                Authorization: `Bearer ${token}`,
                // যদি ব্যাকএন্ড সরাসরি কুকি চেক করে তবে নিচের লাইন দিন
                Cookie: `accessToken=${token}`
            }
        });
        watchlistData = res.data.data || [];
    } catch (error: any) {
        // রিডাইরেক্ট এরর বাদে অন্য এররগুলো এখানে দেখাবে
        if (error.response?.status === 401) {
            console.error("Unauthorized access to watchlist");
        } else {
            console.error("Watchlist fetch error:", error.message);
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <WatchlistClient initialWatchlist={watchlistData} />
            </div>
        </div>
    );
}