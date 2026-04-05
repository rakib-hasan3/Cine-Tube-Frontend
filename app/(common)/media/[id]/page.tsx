import MediaDetailsClient from "@/components/Media/MediaDetailsClient";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axiosInstance from "@/lib/axios";

type Props = {
    params: Promise<{ id: string }>;
};

// ১. SEO এর জন্য ডাইনামিক মেটাডাটা
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const res = await axiosInstance.get(`/media/${id}`);
        const movie = res.data?.data;
        return {
            title: `${movie?.title} - CineTube`,
            description: movie?.description,
            openGraph: { images: [movie?.posterUrl] },
        };
    } catch (error) {
        return { title: "Media Details - CineTube" };
    }
}

export default async function MediaDetailsPage({ params }: Props) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    // ২. লগইন প্রোটেকশন (কুকি না থাকলে রিডাইরেক্ট)
    if (!token) {
        redirect(`/login?callbackUrl=/media/${id}`);
    }

    try {
        // ৩. কুকি হেডার সহ ডাটা ফেচ
        const res = await axiosInstance.get(`/media/${id}`, {
            headers: {
                Cookie: `accessToken=${token}`, // আপনার সেশন মেইনটেইন করার জন্য
            },
        });

        return <MediaDetailsClient movie={res.data.data} />;
    } catch (error: any) {
        if (error.response?.status === 401) redirect("/login");
        return <div className="py-20 text-center">Something went wrong!</div>;
    }
}