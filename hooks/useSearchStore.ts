import { create } from 'zustand';

interface SearchState {
    isSearchModalOpen: boolean;
    openSearch: () => void;
    closeSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    isSearchModalOpen: false,
    openSearch: () => set({ isSearchModalOpen: true }),
    closeSearch: () => set({ isSearchModalOpen: false }),
}));
