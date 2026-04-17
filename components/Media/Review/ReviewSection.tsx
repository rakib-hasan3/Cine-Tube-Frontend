"use client";
import React, { useState } from "react";
import { Star, Loader2, MessageSquare, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";

const ReviewComments = ({ reviewId, onReplyClick }: { reviewId: string, onReplyClick: (id: string, name: string) => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: commentRes, isLoading } = useQuery({
        queryKey: ["comments", reviewId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/comments/${reviewId}`);
            return res.data;
        },
        enabled: !!reviewId,
    });

    const comments = commentRes?.data?.data || [];
    const visibleComments = isExpanded ? comments : comments.slice(0, 2);

    if (isLoading) return <div className="ml-10 text-[10px] text-gray-600 animate-pulse mt-2">Loading replies...</div>;
    if (comments.length === 0) return null;

    return (
        <div className="mt-4 space-y-4 ml-10 border-l-2 border-white/5 pl-4">
            {visibleComments.map((c: any) => (
                <div key={c.id} className="animate-in slide-in-from-left-2 duration-300">
                    <div className="flex gap-2 items-center mb-1">
                        <span className="text-[11px] font-black uppercase text-indigo-400/80">{c.user?.name}</span>
                        <span className="text-[9px] text-gray-600">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-tight mb-2">
                        {c.content.startsWith('@') ? (
                            <span className="text-indigo-400 font-bold mr-1">{c.content.split(' ')[0]}</span>
                        ) : null}
                        {c.content.startsWith('@') ? c.content.split(' ').slice(1).join(' ') : c.content}
                    </p>
                    <button
                        onClick={() => onReplyClick(reviewId, c.user?.name)}
                        className="text-[9px] font-bold uppercase text-gray-600 hover:text-indigo-400 transition-all"
                    >
                        Reply
                    </button>
                </div>
            ))}
            {comments.length > 2 && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-1 text-[10px] font-black uppercase text-indigo-500 hover:text-white mt-2">
                    {isExpanded ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> See {comments.length - 2} More Replies</>}
                </button>
            )}
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

    const handleReplyInitiate = (id: string, userName: string) => {
        setReplyTo(id);
        setReplyContent(`@${userName.replace(/\s+/g, '')} `);
    };

    const { mutate: submitReview, isPending } = useMutation({
        mutationFn: async (payload: any) => {
            const res = await axiosInstance.post(`/reviews`, payload);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Review posted!");
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["reviews", mediaId] });
        },
    });

    const { mutate: submitComment, isPending: isCommenting } = useMutation({
        mutationFn: async (payload: any) => {
            const res = await axiosInstance.post(`/comments`, payload);
            return res.data;
        },
        onSuccess: (res) => {
            toast.success("Reply added!");
            setReplyContent("");
            setReplyTo(null);
            const rId = res.data?.reviewId || res.reviewId;
            queryClient.invalidateQueries({ queryKey: ["comments", rId] });
        },
    });

    // ফর্ম সাবমিট হ্যান্ডলার (Enter Key এর জন্য)
    const handleMainReviewSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!comment || isPending) return;
        submitReview({ mediaId, rating, content: comment, userId: user.id });
    };

    const handleReplySubmit = (e?: React.FormEvent, revId?: string) => {
        e?.preventDefault();
        if (!replyContent || isCommenting) return;
        submitComment({ reviewId: revId, content: replyContent, userId: user.id });
    };

    const { mutate: toggleLike } = useMutation({
        mutationFn: async (reviewId: string) => {
            return await axiosInstance.post(`/reviews/${reviewId}/like`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", mediaId] });
        },
    });

    return (
        <div className="mt-10 max-w-4xl">
            <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-2 text-white">
                <MessageSquare className="w-5 h-5 text-indigo-500" /> {reviews.length} Cinematic Reviews
            </h3>

            {user && (
                <form onSubmit={handleMainReviewSubmit} className="flex gap-4 mb-12 bg-white/5 p-6 rounded-2xl border border-white/5 group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex-shrink-0 flex items-center justify-center font-bold text-white text-lg uppercase">
                        {user.name?.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-4">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleMainReviewSubmit();
                                }
                            }}
                            placeholder="Write your thoughts... (Enter to post, Shift+Enter for new line)"
                            className="w-full bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none py-2 text-sm transition-all resize-none min-h-[60px] text-white"
                        />
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button type="button" key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(s)}>
                                        <Star className={`w-5 h-5 transition-all ${(hoverRating || rating) >= s ? 'fill-yellow-500 text-yellow-500 scale-110' : 'text-gray-600'}`} />
                                    </button>
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={isPending || !comment}
                                className="px-8 py-2.5 bg-indigo-600 text-white rounded-full text-xs font-black uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Post Review"}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <div className="space-y-10">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500 w-10 h-10" /></div>
                ) : (
                    reviews.map((rev: any) => (
                        <div key={rev.id} className="group/item">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0 flex items-center justify-center text-gray-400 border border-white/10 font-bold uppercase text-xs">
                                    {rev.user?.name?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-black uppercase text-white tracking-wide">{rev.user?.name}</span>
                                        <span className="text-[10px] text-gray-600 ml-auto bg-white/5 px-2 py-0.5 rounded-full">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-800'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed font-medium mb-4 bg-white/[0.02] p-3 rounded-lg border border-white/5">{rev.content}</p>

                                    <div className="flex items-center gap-3">
                                        <button onClick={() => toggleLike(rev.id)} className={`flex items-center gap-1.5 text-[10px] font-black uppercase transition-all px-3 py-1.5 rounded-full border ${rev.isLiked ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5 border-transparent'}`}>
                                            <ThumbsUp className={`w-3 h-3 ${rev.isLiked ? 'fill-current' : ''}`} /> {rev._count?.likes || 0}
                                        </button>
                                        <button onClick={() => handleReplyInitiate(rev.id, rev.user?.name)} className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full transition-all ${replyTo === rev.id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-white/5 hover:text-indigo-400'}`}>
                                            Reply
                                        </button>
                                    </div>

                                    {replyTo === rev.id && (
                                        <form onSubmit={(e) => handleReplySubmit(e, rev.id)} className="mt-4 flex gap-3 animate-in zoom-in-95 duration-200">
                                            <input
                                                autoFocus
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="Write a reply... (Enter to post)"
                                                className="flex-1 bg-white/5 border border-white/10 focus:border-indigo-500 outline-none px-4 py-2 rounded-full text-xs text-white"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isCommenting || !replyContent}
                                                className="px-5 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all"
                                            >
                                                {isCommenting ? "..." : "Reply"}
                                            </button>
                                        </form>
                                    )}

                                    <ReviewComments reviewId={rev.id} onReplyClick={handleReplyInitiate} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}