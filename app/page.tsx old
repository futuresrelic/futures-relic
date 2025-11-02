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
                <Dashboard />
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

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: '🔮',
            title: 'Discover Relics',
            description: 'Collect unique NFTs from the Future\'s Relic collection',
          },
          {
            icon: '⚗️',
            title: 'Master Blends',
            description: 'Combine relics to unlock rare artifacts and advance the story',
          },
          {
            icon: '📖',
            title: 'Uncover Mysteries',
            description: 'Progress through the chronicle and reveal hidden truths',
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-vintage-oldPaper border-4 border-vintage-sepia p-6"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-vintage font-bold text-vintage-sepia mb-2">
              {feature.title}
            </h3>
            <p className="text-vintage-darkBrown opacity-80">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { userNFTs, blendRecipes, userProgress } = useAppStore();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-vintage font-bold text-vintage-cream mb-4">
          Your Chronicle Dashboard
        </h2>
        <p className="text-xl text-vintage-gold italic">
          Track your progress through Future's Relic
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          icon="🔮"
          label="Relics Owned"
          value={userNFTs.length}
          color="blue"
        />
        <StatCard
          icon="⚗️"
          label="Active Blends"
          value={blendRecipes.filter(b => b.is_active).length}
          color="purple"
        />
        <StatCard
          icon="📖"
          label="Scenes Unlocked"
          value={userProgress?.unlockedScenes.length || 0}
          color="gold"
        />
        <StatCard
          icon="✨"
          label="Blends Completed"
          value={userProgress?.completedBlends.length || 0}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-2xl font-vintage font-bold text-vintage-cream mb-4">
            🎯 Recommended Actions
          </h3>
          <BlendRecommendations />
        </div>
        
        <div>
          <h3 className="text-2xl font-vintage font-bold text-vintage-cream mb-4">
            📖 Recent Story Progress
          </h3>
          <StoryProgression />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: string;
  label: string;
  value: number;
  color: string;
}> = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'border-blue-600 bg-blue-50',
    purple: 'border-purple-600 bg-purple-50',
    gold: 'border-vintage-gold bg-vintage-oldPaper',
    green: 'border-green-600 bg-green-50',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} border-4 p-6 text-center`}>
      <div className="text-5xl mb-3">{icon}</div>
      <div className="text-4xl font-vintage font-bold text-vintage-darkBrown mb-2">
        {value}
      </div>
      <div className="text-sm font-bold text-vintage-sepia uppercase">
        {label}
      </div>
    </div>
  );
};
