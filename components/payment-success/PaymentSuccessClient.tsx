// // src/app/payment-success/PaymentSuccessClient.tsx
// "use client";

// import React, { useEffect } from "react"; // ✅ useEffect যোগ করুন
// import Link from "next/navigation"; // Next.js এর জন্য navigation ব্যবহার করা ভালো
// import { CheckCircle2, ArrowRight, PlayCircle } from "lucide-react";
// import { useAuth } from "@/providers/AuthProvider"; // ✅ আপনার অথ হুক ইমপোর্ট করুন

// const PaymentSuccessClient = () => {
//     const { refreshUser } = useAuth() as any; // ✅ ইউজার রিফ্রেশ করার ফাংশনটি নিন

//     useEffect(() => {
//         // ১. এই পেজে আসার সাথে সাথে ব্যাকএন্ড থেকে লেটেস্ট ডাটা আনবে
//         if (refreshUser) {
//             refreshUser();
//         }

//         // ২. যদি আপনার refreshUser না থাকে, তবে অন্তত পেজটা একবার রিফ্রেশ করা উচিত
//         // (বিকল্প বুদ্ধি হিসেবে নিচের লাইনটা ব্যবহার করতে পারেন যদি refreshUser কাজ না করে)
//         // window.location.reload();
//     }, []);

//     return (
//         <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
//             <div className="max-w-md w-full bg-[#111111] border border-zinc-800 rounded-3xl p-10 text-center shadow-[0_0_50px_-12px_rgba(34,197,94,0.2)]">

//                 {/* Success Icon */}
//                 <div className="flex justify-center mb-8">
//                     <div className="relative">
//                         <div className="absolute inset-0 bg-green-500/25 blur-2xl rounded-full scale-150"></div>
//                         <CheckCircle2 className="relative w-24 h-24 text-green-500 stroke-[1.5]" />
//                     </div>
//                 </div>

//                 {/* Content Section */}
//                 <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
//                     Payment Successful!
//                 </h1>
//                 <p className="text-zinc-400 text-lg leading-relaxed mb-10">
//                     Welcome to the premium club! Your subscription is now active. Enjoy unlimited access to all movies and shows.
//                 </p>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col gap-4">
//                     <a // Link এর বদলে সরাসরি Anchor tag দিলে Force Refresh হবে যা আপনার জন্য ভালো
//                         href="/"
//                         className="flex items-center justify-center w-full bg-white text-black font-bold py-4 px-6 rounded-2xl hover:bg-zinc-200 active:scale-[0.98] transition-all gap-2"
//                     >
//                         Go to Dashboard <ArrowRight size={20} />
//                     </a>

//                     <a
//                         href="/media"
//                         className="flex items-center justify-center w-full bg-zinc-900 text-zinc-300 font-semibold py-4 px-6 rounded-2xl hover:bg-zinc-800 hover:text-white border border-zinc-800 transition-all gap-2"
//                     >
//                         Start Watching <PlayCircle size={20} />
//                     </a>
//                 </div>

//                 {/* Support Link */}
//                 <p className="mt-10 text-sm text-zinc-600">
//                     Having issues? <a href="/support" className="text-zinc-400 underline hover:text-white">Contact Support</a>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default PaymentSuccessClient;