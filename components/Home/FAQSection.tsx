"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ChevronDown } from "lucide-react";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
    return (
        <div className="mb-6">
            <button
                onClick={onClick}
                className={`w-full flex items-center justify-between p-5 md:p-8 rounded-2xl bg-white/5 border transition-all duration-300 text-left ${isOpen ? 'border-indigo-500/50 bg-white/10' : 'border-white/10 hover:bg-white/10'
                    }`}
            >
                <span className="text-lg md:text-xl font-bold text-white tracking-tight">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-2 rounded-full ${isOpen ? 'bg-indigo-600' : 'bg-white/5'}`}
                >
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-gray-400'}`} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="p-8 text-gray-400 text-base md:text-lg leading-relaxed bg-white/[0.02] rounded-b-2xl border-x border-b border-white/5 -mt-2">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "What is CineTube?",
            answer: "CineTube is a premium movie streaming platform designed to provide a high-quality, cinematic experience. We offer a curated selection of trending movies, classics, and originals, all accessible from a sleek, user-friendly interface."
        },
        {
            question: "Is CineTube free to use?",
            answer: "CineTube offers both free and premium content. While many movies are available for free exploration, our premium subscription unlocks unlimited access to our entire library, including exclusive releases and ad-free viewing."
        },
        {
            question: "How does Continue Watching work?",
            answer: "Our system automatically tracks your progress as you watch. If you stop a movie, we save your exact timestamp. Next time you visit, simply click 'Resume' from your 'Continue Watching' row to pick up right where you left off."
        },
        {
            question: "Do I need an account to watch movies?",
            answer: "While you can browse the library without an account, creating one allows you to save your watchlist, track your viewing history, and sync your progress across multiple devices seamlessly."
        },
        {
            question: "Can I resume movies from where I left off?",
            answer: "Absolutely! CineTube is built with a smart persistence engine. Whether you're on your phone, tablet, or desktop, your progress is synced in real-time, ensuring a truly continuous entertainment experience."
        }
    ];

    return (
        <section id="FAQ" className="py-20 md:py-32 relative">
            {/* Background Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-indigo-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">Information</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
                        Frequently Asked <span className="text-indigo-500">Questions.</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={activeIndex === index}
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        />
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-white/10 text-center"
                >
                    <p className="text-gray-400 font-medium">Still have questions? Contact our support team for more help.</p>
                    <button className="mt-4 text-white font-bold hover:text-indigo-400 transition-colors underline underline-offset-8">
                        Visit Support Center
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
