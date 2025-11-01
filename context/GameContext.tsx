'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { waxService } from '@/services/waxService';
import { WalletState, GameProgress, NFTAsset, StoryScene, BlendRecipe } from '@/types';

interface GameContextType {
  wallet: WalletState;
  progress: GameProgress;
  scenes: StoryScene[];
  blendRecipes: BlendRecipe[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  unlockScene: (sceneId: string) => void;
  completeBlend: (blendId: string) => void;
  discoverRelic: (relicId: string) => void;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Sample story scenes - you can customize these
const initialScenes: StoryScene[] = [
  {
    id: 'scene_1',
    title: 'The Discovery',
    content: 'In the depths of an abandoned archive, dust motes dance in shafts of dying light. A leather-bound tome, its pages yellowed with age, speaks of artifacts lost to time...',
    requiredNFTs: [], // No requirements - starter scene
    unlocked: false,
    cinematicEffect: 'fade',
  },
  {
    id: 'scene_2',
    title: 'The First Relic',
    content: 'Your fingers trace the contours of an ancient mechanism. Its brass gears, frozen for decades, suddenly whir to life. The air crackles with possibilities long forgotten...',
    requiredNFTs: ['123456'], // Replace with actual template IDs
    unlocked: false,
    cinematicEffect: 'flicker',
  },
  {
    id: 'scene_3',
    title: 'Convergence',
    content: 'Three relics align upon the workbench. Ancient symbols glow with an ethereal light as the artifacts recognize each other across the centuries. Something awakens...',
    requiredNFTs: ['123456', '123457', '123458'],
    unlocked: false,
    cinematicEffect: 'fade',
  },
];

// Sample blend recipes
const initialBlendRecipes: BlendRecipe[] = [
  {
    id: 'blend_1',
    name: 'The Chronometer',
    requiredTemplates: ['123456', '123457', '123458'],
    resultTemplateId: '999999',
    resultName: 'Eternal Chronometer',
    resultImage: '/relics/chronometer.png',
    description: 'Combine three ancient gears to forge a device that transcends time itself.',
  },
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    accountName: null,
    nfts: [],
  });

  const [progress, setProgress] = useState<GameProgress>({
    unlockedScenes: [],
    completedBlends: [],
    discoveredRelics: [],
    currentChapter: 1,
  });

  const [scenes, setScenes] = useState<StoryScene[]>(initialScenes);
  const [blendRecipes] = useState<BlendRecipe[]>(initialBlendRecipes);
  const [isLoading, setIsLoading] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('futuresrelic_progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('futuresrelic_progress', JSON.stringify(progress));
  }, [progress]);

  // Check for auto-login
  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const isAvailable = await waxService.isAutoLoginAvailable();
        if (isAvailable) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Auto-login check failed:', error);
      }
    };
    checkAutoLogin();
  }, []);

  // Update unlocked scenes based on owned NFTs
  useEffect(() => {
    if (wallet.isConnected && wallet.nfts.length > 0) {
      const ownedTemplates = wallet.nfts.map(nft => nft.template_id);
      
      const updatedScenes = scenes.map(scene => {
        const hasRequiredNFTs = scene.requiredNFTs.every(templateId =>
          ownedTemplates.includes(templateId)
        );
        
        if (hasRequiredNFTs && !scene.unlocked) {
          // Auto-unlock scene if requirements met
          if (!progress.unlockedScenes.includes(scene.id)) {
            setProgress(prev => ({
              ...prev,
              unlockedScenes: [...prev.unlockedScenes, scene.id],
            }));
          }
          return { ...scene, unlocked: true };
        }
        
        return {
          ...scene,
          unlocked: progress.unlockedScenes.includes(scene.id),
        };
      });
      
      setScenes(updatedScenes);
    }
  }, [wallet.nfts, progress.unlockedScenes]);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const accountName = await waxService.login();
      const nfts = await waxService.fetchUserNFTs(accountName, 'futuresrelic');
      
      setWallet({
        isConnected: true,
        accountName,
        nfts,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      accountName: null,
      nfts: [],
    });
  };

  const unlockScene = (sceneId: string) => {
    setProgress(prev => ({
      ...prev,
      unlockedScenes: [...new Set([...prev.unlockedScenes, sceneId])],
    }));
  };

  const completeBlend = (blendId: string) => {
    setProgress(prev => ({
      ...prev,
      completedBlends: [...new Set([...prev.completedBlends, blendId])],
    }));
  };

  const discoverRelic = (relicId: string) => {
    setProgress(prev => ({
      ...prev,
      discoveredRelics: [...new Set([...prev.discoveredRelics, relicId])],
    }));
  };

  return (
    <GameContext.Provider
      value={{
        wallet,
        progress,
        scenes,
        blendRecipes,
        connectWallet,
        disconnectWallet,
        unlockScene,
        completeBlend,
        discoverRelic,
        isLoading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
