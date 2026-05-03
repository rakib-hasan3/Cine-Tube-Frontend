import MediaClientContent from "@/components/Media/MediaClientContent";
import axiosInstance from "@/lib/axios";

// ১. ডাইনামিক রেন্ডারিং ফোর্স করা (কুকি বা এপিআই এর জন্য জরুরি)
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Explore Movies | CineTube",
    description: "Browse our vast collection of movies and series on CineTube.",
};

export default async function AllMediaPage() {
    let mediaData = [];
    try {
        // নোট: বিল্ডের সময় ব্যাকএন্ড সার্ভার চালু থাকতে হবে
        const res = await axiosInstance.get("/media");
        mediaData = res.data?.data?.data || res.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch media:", error);
        // ডাটা না পেলে খালি অ্যারে পাঠাবে যাতে বিল্ড ক্র্যাশ না করে
        mediaData = [];
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <MediaClientContent initialMedia={mediaData} />
        </div>
    );
}