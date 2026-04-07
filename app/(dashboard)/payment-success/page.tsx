// src/app/payment-success/page.tsx

import PaymentSuccessClient from "@/components/payment-success/PaymentSuccessClient";
import { Metadata } from "next";

// SEO এর জন্য মেটাডাটা এখানে থাকবে
export const metadata: Metadata = {
    title: "Payment Successful | Cine-Tube",
    description: "Your payment was successful. Enjoy premium access to Cine-Tube.",
    robots: { index: false, follow: false }, // পেমেন্ট পেজ ইনডেক্স না করাই ভালো
};

export default function PaymentSuccessPage() {
    return <PaymentSuccessClient />;
}