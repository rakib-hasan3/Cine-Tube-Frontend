// app/(common)/pricing/page.tsx
import { Check, Zap } from "lucide-react";

const plans = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for exploring our library with ads.",
        features: ["720p Streaming", "Access to Free Movies", "Ad-supported", "1 Device"],
        buttonText: "Start Free",
        popular: false,
    },
    {
        name: "Premium",
        price: "9.99",
        description: "The best experience for movie lovers.",
        features: ["4K Ultra HD", "Ad-free Experience", "Exclusive Content", "4 Devices", "Offline Downloads"],
        buttonText: "Get Premium",
        popular: true, // এটাকে হাইলাইট করব
    },
    {
        name: "Family",
        price: "19.99",
        description: "Enjoy with your friends and family.",
        features: ["4K + HDR", "No Ads", "Early Access", "10 Devices", "Personalized Profiles"],
        buttonText: "Choose Family",
        popular: false,
    }
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white py-20 px-6">
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-20">
                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Pricing Plans</h2>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
                    Ready to watch your <span className="text-indigo-600">favorites?</span>
                </h1>
                <p className="text-xl text-gray-500 font-medium">Choose a plan that fits your lifestyle. No hidden fees.</p>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`relative p-10 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 ${plan.popular
                                ? "bg-gray-900 text-white shadow-[0_40px_80px_-15px_rgba(79,70,229,0.3)] ring-4 ring-indigo-500/10"
                                : "bg-white border border-gray-100 shadow-xl shadow-gray-100 hover:shadow-2xl"
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-10 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-tighter flex items-center gap-1 shadow-lg">
                                <Zap className="w-3 h-3 fill-white" /> Most Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className={`text-xl font-black mb-2 ${plan.popular ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                            <p className={`text-sm font-medium ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>{plan.description}</p>
                        </div>

                        <div className="mb-8">
                            <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                            <span className={`text-sm font-bold ml-2 ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>/ month</span>
                        </div>

                        <ul className="space-y-4 mb-10">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-semibold">
                                    <div className={`p-1 rounded-full ${plan.popular ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${plan.popular
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                            }`}>
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}