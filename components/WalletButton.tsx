'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';

export function WalletButton() {
  const { wallet, connectWallet, disconnectWallet, isLoading } = useGame();

  if (wallet.isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-vintage-sepia font-vintage text-sm">
          {wallet.accountName}
        </div>
        <button
          onClick={disconnectWallet}
          className="border border-vintage-gold bg-vintage-dark px-6 py-2 font-vintage text-vintage-sepia transition-all hover:bg-vintage-gold hover:text-vintage-dark"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isLoading}
      className="border-2 border-vintage-gold bg-vintage-dark px-8 py-3 font-vintage text-lg text-vintage-sepia shadow-lg transition-all hover:bg-vintage-gold hover:text-vintage-dark hover:shadow-vintage-gold/50 disabled:opacity-50"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-pulse">Connecting...</span>
        </span>
      ) : (
        'Connect WAX Wallet'
      )}
    </button>
  );
}
