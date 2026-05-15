import MovieDetailsUI from "@/components/Media/MovieDetailsUI";
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
            title: `${movie?.title} - CineTube`,
            description: movie?.description,
            openGraph: { images: [movie?.posterUrl] },
        };
    } catch (error) {
        return { title: "Movie Details - CineTube" };
    }
}

export default async function MovieDetailsPage({ params }: Props) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        redirect(`/login?callbackUrl=/movie/${id}`);
    }

    try {
        // Fetch current movie
        const movieRes = await axiosInstance.get(`/media/${id}`, {
            headers: { Cookie: `accessToken=${token}` },
        });
        const movie = movieRes.data.data;

        // Fetch all media to find similar ones
        const allRes = await axiosInstance.get("/media");
        const allMedia = allRes.data?.data?.data || allRes.data?.data || [];
        
        // Simple logic for related movies: same first genre, exclude current
        const relatedMovies = allMedia
            .filter((m: any) => 
                (m.id !== id && m._id !== id) && 
                (Array.isArray(m.genre) && Array.isArray(movie.genre) ? m.genre[0] === movie.genre[0] : m.genre === movie.genre)
            )
            .slice(0, 6);

        return <MovieDetailsUI movie={movie} relatedMovies={relatedMovies} />;
    } catch (error: any) {
        if (error.response?.status === 401) redirect("/login");
        return <div className="py-20 text-center">Something went wrong!</div>;
    }
}
