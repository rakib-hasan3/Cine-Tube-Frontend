"use client";
import Link from "next/link";

interface NavItemProps {
    name: string;
    href: string;
    isActive: boolean;
    onClick?: () => void;
}

export default function NavItem({ name, href, isActive, onClick }: NavItemProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`relative text-sm font-bold transition-all duration-300 ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`}
        >
            {name}
            {isActive && (
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
            )}
        </Link>
    );
}
