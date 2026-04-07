"use client";
import React, { useState } from "react";
import { Star, Loader2, Mail, MessageSquare, ThumbsUp } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";

// রিভিউর নিচের কমেন্টগুলো লোড করার জন্য আলাদা ছোট কম্পোনেন্ট
const ReviewComments = ({ reviewId }: { reviewId: string }) => {
    const { data: commentRes, isLoading } = useQuery({
        queryKey: ["comments", reviewId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/comments/${reviewId}`);
            return res.data;
        },
        enabled: !!reviewId, // reviewId থাকলেই কেবল কুয়েরি চলবে
    });

    // আপনার ব্যাকএন্ডের পেজিনেশন স্ট্রাকচার অনুযায়ী ডাটা এক্সেস
    const comments = commentRes?.data?.data || [];

    if (isLoading) return <div className="ml-10 text-[10px] text-gray-600 animate-pulse mt-2">Loading...</div>;

    return (
        <div className="mt-4 space-y-4 ml-10 border-l border-white/5 pl-4">
            {comments.length > 0 ? (
                comments.map((c: any) => (
                    <div key={c.id} className="animate-in slide-in-from-left-2 duration-300">
                        <div className="flex gap-2 items-center mb-1">
                            <span className="text-[11px] font-black uppercase text-indigo-400/80">{c.user?.name}</span>
                            <span className="text-[9px] text-gray-600">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-tight">{c.content}</p>
                    </div>
                ))
            ) : null}
        </div>
    );
};

export default function ReviewSection({ mediaId }: { mediaId: string }) {
    const { user } = useAuth() as any;
    const queryClient = useQueryClient();

    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");

    const { data: apiResponse, isLoading } = useQuery({
        queryKey: ["reviews", mediaId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/reviews/${mediaId}`);
            return res.data;
        },
    });

    const reviews = apiResponse?.data?.data || [];

    // ১. মেইন রিভিউ সাবমিট (POST /reviews)
    const { mutate: submitReview, isPending } = useMutation({
        mutationFn: async (payload: any) => {
            const res = await axiosInstance.post(`/reviews`, payload);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Review posted!");
            setComment("");
            setRating(5);
            queryClient.invalidateQueries({ queryKey: ["reviews", mediaId] });
        },
    });

    // ২. কমেন্ট/রিপ্লাই সাবমিট (POST /comments)
    const { mutate: submitComment, isPending: isCommenting } = useMutation({
        mutationFn: async (payload: any) => {
            const res = await axiosInstance.post(`/comments`, payload);
            return res.data;
        },
        onSuccess: (res) => {
            toast.success("Comment added!");
            setReplyContent("");
            setReplyTo(null);
            // রিভিউ আইডি ধরে শুধু ওই কমেন্ট সেকশন রিফ্রেশ করা
            // আপনার এপিআই রেসপন্স অনুযায়ী data.reviewId অথবা data.data.reviewId হতে পারে
            const rId = res.data?.reviewId || res.reviewId;
            queryClient.invalidateQueries({ queryKey: ["comments", rId] });
        },
    });

    const handleReplySubmit = (reviewId: string) => {
        if (!replyContent) return toast.error("Write something first!");
        submitComment({
            reviewId,
            content: replyContent,
            userId: user.id
        });
    };

    return (
        <div className="mt-10">
            <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500" /> {reviews.length} Comments
            </h3>

            {/* রিভিউ ইনপুট সেকশন */}
            {user && (
                <div className="flex gap-4 mb-10 group">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center font-bold text-white">
                        {user.name?.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-4">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a cinematic review..."
                            className="w-full bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none py-1 text-sm transition-all resize-none min-h-[40px]"
                        />

                        <div className="flex justify-between items-center opacity-0 group-focus-within:opacity-100 transition-all duration-300">
                            <div className="flex gap-1 items-center">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(s)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(s)}
                                        className="transition-transform hover:scale-125"
                                    >
                                        <Star
                                            className={`w-5 h-5 transition-colors ${(hoverRating || rating) >= s
                                                ? 'fill-yellow-500 text-yellow-500'
                                                : 'text-gray-600'
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="text-[10px] ml-2 font-black uppercase text-gray-500 italic">
                                    {(hoverRating || rating) === 5 ? "Masterpiece" : (hoverRating || rating) >= 3 ? "Good" : "Average"}
                                </span>
                            </div>

                            <button
                                onClick={() => submitReview({ mediaId, rating, content: comment, userId: user.id })}
                                disabled={isPending || !comment}
                                className="px-6 py-2 bg-indigo-600 rounded-full text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2"
                            >
                                {isPending && <Loader2 className="w-3 h-3 animate-spin" />} Post
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* রিভিউ লিস্ট */}
            <div className="space-y-8">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
                    </div>
                ) : (
                    reviews.map((rev: any) => (
                        <div key={rev.id} className="animate-in fade-in duration-500">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0 flex items-center justify-center text-gray-400 border border-white/5 font-bold">
                                    {rev.user?.name?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-black uppercase text-white tracking-tight">{rev.user?.name}</span>
                                        <span className="text-[10px] text-gray-600 ml-auto">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex gap-0.5 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-2.5 h-2.5 ${i < rev.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-800'}`} />
                                        ))}
                                    </div>

                                    <p className="text-sm text-gray-300 leading-relaxed font-medium mb-3">{rev.content}</p>

                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-all">
                                            <ThumbsUp className="w-3 h-3" /> Like
                                        </button>
                                        <button
                                            onClick={() => setReplyTo(replyTo === rev.id ? null : rev.id)}
                                            className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-500 hover:text-indigo-400 transition-all"
                                        >
                                            Reply
                                        </button>
                                    </div>

                                    {/* কমেন্ট/রিপ্লাই ইনপুট বক্স */}
                                    {replyTo === rev.id && (
                                        <div className="mt-4 flex gap-3 animate-in slide-in-from-top-2 duration-300">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-[10px]">
                                                {user?.name?.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    autoFocus
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    placeholder="Add a comment to this review..."
                                                    className="w-full bg-transparent border-b border-white/10 focus:border-white outline-none py-1 text-xs transition-all mb-2"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setReplyTo(null)} className="px-3 py-1 text-[9px] font-black uppercase text-gray-500 hover:text-white">Cancel</button>
                                                    <button
                                                        onClick={() => handleReplySubmit(rev.id)}
                                                        disabled={isCommenting}
                                                        className="px-4 py-1 bg-white text-black rounded-full text-[9px] font-black uppercase hover:bg-indigo-500 hover:text-white transition-all"
                                                    >
                                                        {isCommenting ? <Loader2 className="w-2 h-2 animate-spin" /> : "Comment"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* রিভিউর নিচের কমেন্টগুলো */}
                                    <ReviewComments reviewId={rev.id} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}