// app/(auth)/login/page.tsx
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-blue-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-12 rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.05)] border border-white">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
                        Welcome Back
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        Log In to <span className="text-indigo-600">CineTube</span>
                    </h2>
                </div>

                {/* Form */}
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-bold text-gray-700">Password</label>
                            <Link href="#" className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
                                Forgot?
                            </Link>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300"
                        />
                    </div>

                    <button className="w-full py-4.5 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold shadow-xl shadow-gray-200 transition-all active:scale-95 transform duration-200">
                        Sign In
                    </button>
                </form>

                {/* Footer */}
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