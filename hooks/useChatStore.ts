import { create } from 'zustand';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
}

interface ChatState {
    isOpen: boolean;
    messagesByMovie: Record<string, Message[]>;
    toggleChat: () => void;
    setIsOpen: (isOpen: boolean) => void;
    addMessage: (movieId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    isOpen: false,
    messagesByMovie: {},
    toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
    setIsOpen: (isOpen) => set({ isOpen }),
    addMessage: (movieId, message) =>
        set((state) => ({
            messagesByMovie: {
                ...state.messagesByMovie,
                [movieId]: [...(state.messagesByMovie[movieId] || []), message],
            },
        })),
}));
