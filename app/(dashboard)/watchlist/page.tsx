// app/profile/watchlist/page.tsx
import PremiumWatchlistClient from "@/components/Watchlist/PremiumWatchlistClient";
import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";

export const metadata = {
    title: "My Watchlist | CineTube",
    description: "View and manage your favorite movies in CineTube watchlist.",
};

export default async function WatchlistPage() {
    let watchlistData = [];

    try {
        // সার্ভার সাইড থেকে কুকি নিয়ে টোকেন পাস করা (যদি প্রয়োজন হয়)
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await axiosInstance.get("/watchlist", {
            headers: { Authorization: `Bearer ${token}` }
        });

        watchlistData = res.data.data || [];
    } catch (error) {
        console.error("Watchlist fetch error:", error);
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* এখানে ক্লায়েন্ট কম্পোনেন্ট কল হবে */}
                <PremiumWatchlistClient initialWatchlist={watchlistData} />
            </div>
        </div>
    );
}