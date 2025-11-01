'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { loginWithWax, autoLogin, logout } from '@/lib/wax';
import { fetchUserNFTs, fetchBlendRecipes, fetchDrops } from '@/lib/api';

export const WalletConnect: React.FC = () => {
  const {
    account,
    isConnecting,
    setAccount,
    setIsConnecting,
    setUserNFTs,
    setBlendRecipes,
    setDrops,
    setIsLoadingNFTs,
    setIsLoadingBlends,
    setUserProgress,
  } = useAppStore();

  // Try auto-login on mount
  useEffect(() => {
    const tryAutoLogin = async () => {
      setIsConnecting(true);
      const acc = await autoLogin();
      if (acc) {
        setAccount(acc);
        await loadUserData(acc.accountName);
      }
      setIsConnecting(false);
    };

    tryAutoLogin();
  }, []);

  const loadUserData = async (accountName: string) => {
    try {
      // Load NFTs
      setIsLoadingNFTs(true);
      const nfts = await fetchUserNFTs(accountName);
      setUserNFTs(nfts);
      setIsLoadingNFTs(false);

      // Load blend recipes
      setIsLoadingBlends(true);
      const blends = await fetchBlendRecipes();
      setBlendRecipes(blends);
      setIsLoadingBlends(false);

      // Load drops
      const drops = await fetchDrops();
      setDrops(drops);

      // Initialize user progress (load from localStorage or Firebase)
      const savedProgress = localStorage.getItem(`progress_${accountName}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      } else {
        setUserProgress({
          accountName,
          unlockedScenes: [],
          completedBlends: [],
          lastUpdated: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogin = async () => {
    setIsConnecting(true);
    const acc = await loginWithWax();
    if (acc) {
      setAccount(acc);
      await loadUserData(acc.accountName);
    }
    setIsConnecting(false);
  };

  const handleLogout = async () => {
    await logout();
    setAccount(null);
    setUserNFTs([]);
    setUserProgress(null);
  };

  if (isConnecting) {
    return (
      <button
        disabled
        className="
          px-6 py-3 bg-vintage-sepia text-vintage-cream
          font-vintage text-lg border-2 border-vintage-gold
          opacity-50 cursor-not-allowed
        "
      >
        Connecting...
      </button>
    );
  }

  if (account) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-vintage-cream font-vintage">
          <div className="text-sm opacity-70">Connected</div>
          <div className="font-bold">{account.accountName}</div>
        </div>
        <button
          onClick={handleLogout}
          className="
            px-4 py-2 bg-vintage-rust text-vintage-cream
            font-vintage border-2 border-vintage-sepia
            hover:bg-opacity-80 transition-all
            shadow-lg
          "
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="
        px-8 py-4 bg-vintage-gold text-vintage-darkBrown
        font-vintage text-xl font-bold
        border-4 border-vintage-sepia
        hover:bg-vintage-cream transition-all
        shadow-2xl transform hover:scale-105
        relative overflow-hidden
      "
      style={{
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      }}
    >
      <span className="relative z-10">Connect WAX Wallet</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 animate-pulse" />
    </button>
  );
};
