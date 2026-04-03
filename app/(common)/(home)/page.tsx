// app/page.tsx
import axiosInstance from "@/lib/axios";
import HomeClientContent from "@/components/Home/HomeClientContent";

export const metadata = {
    title: "CineTube | Stream Your Favorite Movies",
    description: "CineTube is a premium media library for exploring movies, series, and reviews.",
};

export default async function HomePage() {
    let initialMedia = [];
    try {
        const res = await axiosInstance.get("/media");
        // আপনার API স্ট্রাকচার অনুযায়ী data.data.data হতে পারে
        initialMedia = res.data.data.data || res.data.data || [];
    } catch (error) {
        console.error("Home Data Fetch Error:", error);
    }

    return (
        <main className="bg-[#0a0a0a]">
            <HomeClientContent initialMedia={initialMedia} />
        </main>
    );
}