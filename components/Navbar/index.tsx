// components/Navbar/index.tsx
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-indigo-100 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto flex h-20 items-center justify-between px-6">

                {/* Logo with Vibrant Gradient */}
                <Link href="/" className="group flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:rotate-12 transition-transform duration-300">
                        CT
                    </div>
                    <span className="text-2xl font-black tracking-tight text-gray-900">
                        Cine<span className="text-indigo-600">Tube</span>
                    </span>
                </Link>

                {/* Desktop Menu - Modern Pill Style */}
                <div className="hidden md:flex items-center bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
                    {['Explore', 'Pricing', 'About'].map((item) => (
                        <Link
                            key={item}
                            href={item === 'Explore' ? '/media' : `/${item.toLowerCase()}`}
                            className="px-6 py-2 text-sm font-semibold text-gray-600 rounded-full hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all duration-200"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Auth Actions - Professional & Clean */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors">
                        Log In
                    </Link>
                    <Link
                        href="/register"
                        className="bg-indigo-600 px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-95"
                    >
                        Get Started Free
                    </Link>
                </div>

            </div>
        </nav>
    );
}