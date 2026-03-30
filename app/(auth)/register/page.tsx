import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata = {
    title: "Create Account | CineTube",
    description: "Join CineTube today to explore thousands of movies and series.",
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.1)] border border-white">

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        Create <span className="text-indigo-600">Account</span>
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">Join CineTube and start streaming</p>
                </div>

                {/* Client Side Form */}
                <RegisterForm />

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Already have an account?{" "}
                        <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}