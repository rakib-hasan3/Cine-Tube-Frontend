// components/Navbar/MobileMenu.tsx
"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X /> : <Menu />}
            </button>
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b flex flex-col p-4 gap-4">
                    <Link href="/media" onClick={() => setIsOpen(false)}>Media</Link>
                    <Link href="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
                    <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                </div>
            )}
        </div>
    );
}