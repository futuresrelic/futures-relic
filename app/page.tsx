'use client';

import React, { useState } from 'react';
import { WalletConnect } from '@/components/WalletConnect';
import { RelicViewer } from '@/components/RelicViewer';
import { BlendRecommendations } from '@/components/BlendRecommendations';
import { StoryProgression } from '@/components/StoryProgression';
import { useAppStore } from '@/lib/store';
import { FilmFrame } from '@/components/VintageOverlay';

export default function Home() {
  const { account } = useAppStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'relics' | 'blends' | 'story'>('dashboard');

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <FilmFrame className="inline-block px-12 py-8 mb-6">
            <h1 className="text-6xl font-vintage font-bold text-vintage-cream mb-2">
              Future's Relic
            </h1>
            <p className="text-xl text-vintage-gold italic">
              A Chronicle Beyond Time
            </p>
          </FilmFrame>

          <div className="mt-8">
            <WalletConnect />
          </div>
        </header>

        {/* Main Content */}
        {account ? (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="flex justify-center gap-4 flex-wrap">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '🎯' },
                { id: 'relics', label: 'Your Relics', icon: '🔮' },
                { id: 'blends', label: 'Blend Guide', icon: '⚗️' },
                { id: 'story', label: 'The Chronicle', icon: '📖' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    px-6 py-3 font-vintage font-bold text-lg
                    border-4 transition-all
                    ${activeTab === tab.id 
                      ? 'bg-vintage-gold text-vintage-darkBrown border-vintage-sepia scale-110' 
                      : 'bg-vintage-cream text-vintage-sepia border-vintage-rust hover:scale-105'}
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === 'dashboard' && (
                <DashboardView />
              )}

              {activeTab === 'relics' && (
                <RelicViewer />
              )}

              {activeTab === 'blends' && (
                <BlendRecommendations />
              )}

              {activeTab === 'story' && (
                <StoryProgression />
              )}
            </div>
          </div>
        ) : (
          <WelcomeScreen />
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-vintage-cream opacity-70">
          <div className="border-t-2 border-vintage-sepia pt-8">
            <p className="text-lg font-vintage mb-4">
              Powered by WAX Blockchain & NeftyBlocks
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="https://neftyblocks.com/collection/futuresrelic"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-vintage-gold transition-colors underline"
              >
                View Collection
              </a>
              <a
                href="https://neftyblocks.com/collection/futuresrelic/blends"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-vintage-gold transition-colors underline"
              >
                Browse Blends
              </a>
              <a
                href="/admin"
                className="hover:text-vintage-gold transition-colors underline"
              >
                Admin
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

const DashboardView: React.FC = () => {
  const { account, userNFTs } = useAppStore();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <FilmFrame className="p-8">
        <h2 className="text-3xl font-vintage font-bold text-vintage-cream mb-6">
          📊 Your Collection
        </h2>
        <div className="space-y-4 text-vintage-oldPaper">
          <div className="flex justify-between text-xl">
            <span>Total Relics:</span>
            <span className="font-bold text-vintage-gold">{userNFTs?.length || 0}</span>
          </div>
          <div className="flex justify-between text-xl">
            <span>Wallet:</span>
            <span className="font-mono text-sm text-vintage-gold">{account?.accountName || 'Not connected'}</span>
          </div>
        </div>
      </FilmFrame>

      <FilmFrame className="p-8">
        <h2 className="text-3xl font-vintage font-bold text-vintage-cream mb-6">
          🎯 Quick Actions
        </h2>
        <div className="space-y-3">
          <a
            href="https://neftyblocks.com/collection/futuresrelic"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-vintage-gold text-vintage-darkBrown text-center font-vintage font-bold text-lg hover:scale-105 transition-all border-2 border-vintage-sepia"
          >
            View on NeftyBlocks →
          </a>
          <a
            href="https://wax.atomichub.io/explorer/collection/wax-mainnet/futuresrelic"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-vintage-cream text-vintage-darkBrown text-center font-vintage font-bold text-lg hover:scale-105 transition-all border-2 border-vintage-rust"
          >
            View on AtomicHub →
          </a>
        </div>
      </FilmFrame>

      <div className="md:col-span-2">
        <FilmFrame className="p-8">
          <h2 className="text-3xl font-vintage font-bold text-vintage-cream mb-6">
            📖 Getting Started
          </h2>
          <div className="space-y-4 text-vintage-oldPaper text-lg">
            <p>
              <strong className="text-vintage-gold">Your Relics:</strong> View and manage all your NFTs from the collection
            </p>
            <p>
              <strong className="text-vintage-gold">Blend Guide:</strong> Discover which blends you can complete with your current relics
            </p>
            <p>
              <strong className="text-vintage-gold">The Chronicle:</strong> Unlock story scenes as you collect more relics
            </p>
          </div>
        </FilmFrame>
      </div>
    </div>
  );
};

const WelcomeScreen: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
      <FilmFrame className="p-12">
        <h2 className="text-4xl font-vintage font-bold text-vintage-cream mb-6">
          Welcome, Time Traveler
        </h2>
        <p className="text-xl text-vintage-oldPaper leading-relaxed mb-8">
          In the year 1927, deep within forgotten archives, ancient artifacts emerged - 
          each whispering tales of futures yet to unfold. These relics, scattered across 
          time and space, await those brave enough to piece together their mysteries.
        </p>
        <p className="text-lg text-vintage-gold italic">
          Connect your WAX wallet to begin your journey through the chronicle.
        </p>
      </FilmFrame>
    </div>
  );
};
