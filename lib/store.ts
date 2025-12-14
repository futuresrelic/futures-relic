import { create } from 'zustand';
import type { WAXAccount, NFTAsset, BlendRecipe, Drop, StoryScene, UserProgress } from '@/types';

interface AppState {
  // Wallet
  account: WAXAccount | null;
  isConnecting: boolean;
  setAccount: (account: WAXAccount | null) => void;
  setIsConnecting: (isConnecting: boolean) => void;

  // NFTs
  userNFTs: NFTAsset[];
  setUserNFTs: (nfts: NFTAsset[]) => void;

  // Blends
  blendRecipes: BlendRecipe[];
  setBlendRecipes: (recipes: BlendRecipe[]) => void;

  // Drops
  drops: Drop[];
  setDrops: (drops: Drop[]) => void;

  // Story Progress
  userProgress: UserProgress | null;
  setUserProgress: (progress: UserProgress | null) => void;
  unlockScene: (sceneId: string) => void;
  completeBlend: (blendId: string) => void;

  // Story Scenes (can be managed via admin or hardcoded)
  storyScenes: StoryScene[];
  setStoryScenes: (scenes: StoryScene[]) => void;
  addStoryScene: (scene: StoryScene) => void;
  updateStoryScene: (sceneId: string, updates: Partial<StoryScene>) => void;

  // Loading states
  isLoadingNFTs: boolean;
  isLoadingBlends: boolean;
  setIsLoadingNFTs: (loading: boolean) => void;
  setIsLoadingBlends: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  account: null,
  isConnecting: false,
  userNFTs: [],
  blendRecipes: [],
  drops: [],
  userProgress: null,
  storyScenes: [],
  isLoadingNFTs: false,
  isLoadingBlends: false,

  // Wallet actions
  setAccount: (account) => set({ account }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),

  // NFT actions
  setUserNFTs: (userNFTs) => set({ userNFTs }),

  // Blend actions
  setBlendRecipes: (blendRecipes) => set({ blendRecipes }),

  // Drop actions
  setDrops: (drops) => set({ drops }),

  // Progress actions
  setUserProgress: (userProgress) => set({ userProgress }),
  
  unlockScene: (sceneId) =>
    set((state) => ({
      userProgress: state.userProgress
        ? {
            ...state.userProgress,
            unlockedScenes: [...new Set([...state.userProgress.unlockedScenes, sceneId])],
            lastUpdated: Date.now(),
          }
        : null,
      storyScenes: state.storyScenes.map((scene) =>
        scene.id === sceneId ? { ...scene, unlocked: true } : scene
      ),
    })),

  completeBlend: (blendId) =>
    set((state) => ({
      userProgress: state.userProgress
        ? {
            ...state.userProgress,
            completedBlends: [...new Set([...state.userProgress.completedBlends, blendId])],
            lastUpdated: Date.now(),
          }
        : null,
    })),

  // Story scene actions
  setStoryScenes: (storyScenes) => set({ storyScenes }),
  
  addStoryScene: (scene) =>
    set((state) => ({
      storyScenes: [...state.storyScenes, scene],
    })),

  updateStoryScene: (sceneId, updates) =>
    set((state) => ({
      storyScenes: state.storyScenes.map((scene) =>
        scene.id === sceneId ? { ...scene, ...updates } : scene
      ),
    })),

  // Loading actions
  setIsLoadingNFTs: (isLoadingNFTs) => set({ isLoadingNFTs }),
  setIsLoadingBlends: (isLoadingBlends) => set({ isLoadingBlends }),
}));
