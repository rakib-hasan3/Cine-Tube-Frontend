// app/(auth)/register/page.tsx (Server Component)
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
    title: "Create Account | CineTube",
    description: "Join CineTube today to explore thousands of movies and series.",
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6 pt-20 relative overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-[400px] relative z-10">
                {/* Back to Home */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 font-bold text-sm uppercase tracking-widest group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="bg-white/[0.03] backdrop-blur-3xl p-6 md:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-1">
                            Join <span className="text-indigo-500">CineTube.</span>
                        </h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Premium Streaming</p>
                    </div>

                    <RegisterForm />

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-indigo-500 font-bold hover:text-indigo-400 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-6 flex justify-center gap-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    <Link href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
                </div>
            </div>
        </div>
    );
}