// app/(auth)/register/page.tsx
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-6">
            <div className="w-full max-auto max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.1)] border border-white">

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        Create <span className="text-indigo-600">Account</span>
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">Join CineTube and start streaming</p>
                </div>

                {/* Form */}
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Rakib Hasan"
                            className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 placeholder:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 placeholder:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200"
                        />
                    </div>

                    <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 mt-4">
                        Create Free Account
                    </button>
                </form>

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