"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore, Message } from "@/hooks/useChatStore";
import axiosInstance from "@/lib/axios";

interface MovieChatProps {
    movieId: string;
}

export default function MovieChat({ movieId }: MovieChatProps) {
    const { isOpen, toggleChat, messagesByMovie, addMessage } = useChatStore();
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messages = messagesByMovie[movieId] || [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue.trim(),
        };

        addMessage(movieId, userMsg);
        setInputValue("");
        setIsLoading(true);

        try {
            const res = await axiosInstance.post("/ai/hybrid-chat", {
                message: userMsg.content,
                movieId,
            });

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: res.data?.data?.response || "I could not process your request.",
            };

            addMessage(movieId, aiMsg);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "Sorry, I am having trouble connecting right now. Please try again later.",
            };
            addMessage(movieId, errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const formatText = (text: string) => {
        // Basic markdown bold parsing and line breaks
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className="fixed bottom-5 right-5 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute bottom-16 right-0 w-[340px] sm:w-[380px] h-[500px] max-h-[75vh] flex flex-col overflow-hidden rounded-2xl bg-[#0f0f0f]/90 backdrop-blur-2xl border border-white/10 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-900/40 to-transparent border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center border border-indigo-400/50 shadow-[0_0_10px_rgba(79,70,229,0.5)]">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm text-white tracking-wide uppercase italic">CineBot</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Online</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleChat}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-2">
                                        <Bot className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Welcome to CineBot</h4>
                                        <p className="text-xs font-medium text-gray-400">Ask me anything about this movie<br/>or get similar recommendations!</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={msg.id}
                                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.role === "ai" && (
                                            <div className="w-7 h-7 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center border border-indigo-400/30 mt-1 shadow-sm">
                                                <Bot className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[85%] px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                                                msg.role === "user"
                                                    ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm"
                                                    : "bg-white/10 text-gray-200 border border-white/10 rounded-2xl rounded-bl-sm"
                                            }`}
                                        >
                                            <div className="whitespace-pre-wrap leading-[1.6]">{formatText(msg.content)}</div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3 justify-start"
                                >
                                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center border border-indigo-400/30 mt-1 shadow-sm">
                                        <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3.5 flex items-center gap-2.5">
                                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                                        <span className="text-xs text-indigo-200 font-medium tracking-wide">CineBot is thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} className="h-1" />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#0a0a0a]/80 backdrop-blur-md border-t border-white/10">
                            <form
                                onSubmit={handleSendMessage}
                                className="relative flex items-center"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about this movie..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-inner"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-1.5 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-gray-500 text-white rounded-full transition-colors shadow-sm"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Bubble */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChat}
                className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-indigo-400/30 transition-colors z-[201]"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </motion.button>
        </div>
    );
}
