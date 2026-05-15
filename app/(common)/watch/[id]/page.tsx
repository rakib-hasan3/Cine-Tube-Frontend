import MediaDetailsClient from "@/components/Media/MediaDetailsClient";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axiosInstance from "@/lib/axios";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const res = await axiosInstance.get(`/media/${id}`);
        const movie = res.data?.data;
        return {
            title: `Watching: ${movie?.title} - CineTube`,
            description: movie?.description,
            openGraph: { images: [movie?.posterUrl] },
        };
    } catch (error) {
        return { title: "Watch - CineTube" };
    }
}

export default async function WatchPage({ params }: Props) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        redirect(`/login?callbackUrl=/watch/${id}`);
    }

    try {
        const res = await axiosInstance.get(`/media/${id}`, {
            headers: {
                Cookie: `accessToken=${token}`,
            },
        });

        return <MediaDetailsClient movie={res.data.data} autoplay={true} />;
    } catch (error: any) {
        if (error.response?.status === 401) redirect("/login");
        return <div className="py-20 text-center">Something went wrong!</div>;
    }
}
