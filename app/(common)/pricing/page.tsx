import PricingButton from "@/components/pricing/PricingButton";
import { Check, Zap, Star, Shield, Users } from "lucide-react";

const plans = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for exploring our library with ads.",
        features: ["720p Streaming", "Access to Free Movies", "Ad-supported", "1 Device"],
        buttonText: "Start Free",
        popular: false,
        icon: <Star className="w-6 h-6 text-gray-400" />
    },
    {
        name: "Premium",
        price: "9.99",
        description: "The best experience for movie lovers.",
        features: ["4K Ultra HD", "Ad-free Experience", "Exclusive Content", "4 Devices", "Offline Downloads"],
        buttonText: "Get Premium",
        popular: true,
        icon: <Zap className="w-6 h-6 text-indigo-400" />
    },
    {
        name: "Family",
        price: "19.99",
        description: "Enjoy with your friends and family.",
        features: ["4K + HDR", "No Ads", "Early Access", "10 Devices", "Personalized Profiles"],
        buttonText: "Choose Family",
        popular: false,
        icon: <Users className="w-6 h-6 text-purple-400" />
    }
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] py-32 px-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 mt-12 md:mt-0">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">Flexible Pricing</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 md:mb-8 leading-none uppercase">
                    Ready to watch your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">favorites?</span>
                </h1>
                <p className="text-base md:text-xl text-gray-400 font-medium max-w-2xl mx-auto px-4">
                    Choose a plan that fits your lifestyle. No hidden fees, cancel anytime.
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`relative p-6 md:p-10 rounded-[2.5rem] transition-all duration-500 border flex flex-col ${plan.popular
                            ? "bg-white/[0.08] border-indigo-500/50 shadow-[0_20px_80px_rgba(79,70,229,0.2)] scale-105 z-10"
                            : "bg-white/[0.03] border-white/5 hover:border-white/10"
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                                Recommended
                            </div>
                        )}

                        <div className="mb-8 md:mb-10">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                {plan.icon}
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2">{plan.name}</h3>
                            <p className="text-sm font-medium text-gray-500">{plan.description}</p>
                        </div>

                        <div className="mb-8 md:mb-10 flex items-baseline gap-1">
                            <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">${plan.price}</span>
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">/mo</span>
                        </div>

                        <div className="flex-grow">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">What's included:</p>
                            <ul className="space-y-4 mb-12">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-300">
                                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? "bg-indigo-600 text-white" : "bg-white/10 text-gray-400"}`}>
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <PricingButton
                            planName={plan.name}
                            buttonText={plan.buttonText}
                            isPopular={plan.popular}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center text-gray-500 text-sm font-medium">
                <p>Have questions? Check our <a href="/faq" className="text-indigo-400 hover:underline">FAQ</a> or contact support.</p>
            </div>
        </div>
    );
}