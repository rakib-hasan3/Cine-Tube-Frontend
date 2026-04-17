"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Film,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    ShieldCheck,
    Bell,
    Menu,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/providers/AuthProvider";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin-dashboard" },
    { label: "Media Management", icon: Film, href: "/media-management" },
    { label: "User Management", icon: Users, href: "/user-management" },
    { label: "Reviews & Moderation", icon: MessageSquare, href: "/review-moderation" },
    { label: "Admin Settings", icon: Settings, href: "/admin-settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { user, setUser } = useAuth();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            localStorage.clear();
            setUser(null);
            window.location.replace("/");
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

            {/* 🔥 Overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                />
            )}

            {/* 🔥 Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-72 z-50
          bg-white/80 backdrop-blur-xl border-r border-gray-200/50
          transform transition-all duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
            >
                <div className="flex flex-col h-full">

                    {/* Logo */}
                    <div className="p-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                CT
                            </div>
                            <span className="text-xl font-black tracking-tight text-gray-900">
                                Admin<span className="text-indigo-600">Hub</span>
                            </span>
                        </Link>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`relative flex items-center gap-4 px-5 py-3.5 rounded-xl font-semibold transition-all group ${isActive
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                        }`}
                                >
                                    {/* 🔥 Active Indicator */}
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-indigo-600 rounded-r-full" />
                                    )}

                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-6 border-t border-gray-100 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-5 py-3.5 w-full text-rose-500 font-semibold hover:bg-rose-50 rounded-xl transition-all"
                        >
                            <LogOut className="w-5 h-5" /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* 🔥 Main */}
            <main className="flex-1 md:ml-72">

                {/* Header */}
                <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">

                    {/* Left */}
                    <div className="flex items-center gap-4">

                        {/* Hamburger */}
                        <button
                            onClick={() => setOpen(true)}
                            className="md:hidden p-2 bg-white shadow-sm border border-gray-200 rounded-xl"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            Secure Admin Session
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-indigo-600 transition">
                            <Bell className="w-5 h-5" />
                        </button>

                        <div className="h-10 w-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-600 text-sm shadow-sm">
                            AD
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 md:p-10">
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </div>
            </main>
        </div>
    );
}