import { cookies } from "next/headers";
import axiosInstance from "@/lib/axios";
import EditProfileForm from "./EditProfileForm";

export default async function EditProfilePage({ params }: { params: { id: string } }) {
    const { id } = params;
    let userData = null;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (token) {
        try {
            const res = await axiosInstance.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            userData = res.data?.data || res.data;
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] py-20 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tighter">Edit Profile</h1>
                    <p className="text-gray-500 font-medium">Update your personal information and profile picture.</p>
                </div>

                <EditProfileForm initialData={userData} />
            </div>
        </main>
    );
}