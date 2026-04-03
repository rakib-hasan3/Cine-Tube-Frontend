// app/media/page.tsx
import MediaClientContent from "@/components/Media/MediaClientContent";
import axiosInstance from "@/lib/axios";

export const metadata = {
    title: "Explore Movies | CineTube",
    description: "Browse our vast collection of movies and series on CineTube.",
};

export default async function AllMediaPage() {
    let mediaData = [];
    try {
        const res = await axiosInstance.get("/media");
        mediaData = res.data.data.data || []; // আপনার এপিআই রেসপন্স অনুযায়ী
    } catch (error) {
        console.error("Failed to fetch media:", error);
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <MediaClientContent initialMedia={mediaData} />
        </div>
    );
}