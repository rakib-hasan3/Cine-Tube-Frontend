"use client"; // এটা অবশ্যই ক্লায়েন্ট কম্পোনেন্ট হতে হবে

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function TanstackProvider({ children }: { children: React.ReactNode }) {
    // useState ব্যবহার করা হয় যাতে প্রতি রেন্ডারে নতুন ক্লায়েন্ট তৈরি না হয়
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}