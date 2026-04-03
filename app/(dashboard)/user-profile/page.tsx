// app/(dashboard)/user-profile/page.tsx
import { cookies } from "next/headers";
import axiosInstance from "@/lib/axios";
import ProfileClientUI from "./ProfileClientUI";

export default async function UserProfilePage() {
    let userData = null;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (token) {
        try {
            const res = await axiosInstance.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            // ডাটা স্ট্রাকচার চেক করুন: res.data.data অথবা সরাসরি res.data
            userData = res.data?.data || res.data;
        } catch (error: any) {
            console.error("Profile Error:", error.response?.data?.message || error.message);
        }
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <ProfileClientUI initialUser={userData} />
        </main>
    );
}