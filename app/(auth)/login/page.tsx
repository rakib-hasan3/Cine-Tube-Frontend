// app/(auth)/login/page.tsx (Server Component)
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
    title: "Login | CineTube",
    description: "Login to your CineTube account to start streaming your favorite movies.",
};

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-blue-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-12 rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.05)] border border-white">

                <div className="text-center mb-10">
                    <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
                        Welcome Back
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        Log In to <span className="text-indigo-600">CineTube</span>
                    </h2>
                </div>

                {/* এখানে আমাদের ক্লায়েন্ট কম্পোনেন্টটি বসিয়ে দিলাম */}
                <LoginForm />

                <div className="mt-10 text-center border-t border-gray-100 pt-8">
                    <p className="text-sm text-gray-500 font-medium">
                        New to CineTube?{" "}
                        <Link href="/register" className="text-indigo-600 font-bold hover:underline">
                            Create an Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}