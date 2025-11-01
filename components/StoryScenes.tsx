'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { StoryScene } from '@/types';

export function StoryScenes() {
  const { scenes, wallet } = useGame();
  const [selectedScene, setSelectedScene] = useState<StoryScene | null>(null);

  const renderScene = (scene: StoryScene) => {
    const cinematicClass = {
      fade: 'animate-fade-in',
      flicker: 'animate-flicker',
      slide: 'animate-slide-in',
    }[scene.cinematicEffect || 'fade'];

    return (
      <div className={`${cinematicClass} border-4 border-vintage-gold bg-vintage-dark p-12`}>
        {/* Scene Title */}
        <div className="mb-8 text-center">
          <h2 className="font-vintage text-4xl text-vintage-sepia">
            {scene.title}
          </h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-vintage-gold"></div>
            <div className="h-1 w-1 rounded-full bg-vintage-gold"></div>
            <div className="h-px w-12 bg-vintage-gold"></div>
          </div>
        </div>

        {/* Scene Image */}
        {scene.image && (
          <div className="mb-8">
            <img
              src={scene.image}
              alt={scene.title}
              className="w-full border-2 border-vintage-sepia opacity-80"
            />
          </div>
        )}

        {/* Scene Content */}
        <div className="prose prose-invert mx-auto max-w-3xl">
          <p className="font-vintage text-lg leading-relaxed text-vintage-sepia">
            {scene.content}
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setSelectedScene(null)}
            className="border-2 border-vintage-gold bg-transparent px-6 py-2 font-vintage text-vintage-sepia transition-all hover:bg-vintage-gold hover:text-vintage-dark"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (!wallet.isConnected) {
    return (
      <div className="text-center">
        <div className="inline-block border-2 border-vintage-gold bg-vintage-dark p-12">
          <p className="font-vintage text-xl text-vintage-sepia">
            Connect your wallet to begin your journey
          </p>
        </div>
      </div>
    );
  }

  if (selectedScene) {
    return <div className="animate-fade-in">{renderScene(selectedScene)}</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="font-vintage text-3xl text-vintage-sepia">
          Chronicles of Future's Past
        </h2>
        <p className="mt-2 text-vintage-sepia/70">
          Uncover the narrative hidden within your relics
        </p>
      </div>

      <div className="space-y-6">
        {scenes.map((scene) => {
          const isUnlocked = scene.unlocked || scene.requiredNFTs.length === 0;
          const ownedTemplates = wallet.nfts.map(nft => nft.template_id);
          const missingNFTs = scene.requiredNFTs.filter(
            templateId => !ownedTemplates.includes(templateId)
          );

          return (
            <div
              key={scene.id}
              className={`border-2 ${
                isUnlocked ? 'border-vintage-gold' : 'border-vintage-sepia/30'
              } bg-vintage-dark p-6 transition-all ${
                isUnlocked ? 'hover:shadow-lg hover:shadow-vintage-gold/30' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-vintage text-2xl text-vintage-sepia">
                    {scene.title}
                  </h3>
                  
                  {isUnlocked ? (
                    <p className="mt-2 text-vintage-sepia/70">
                      Scene unlocked - Ready to experience
                    </p>
                  ) : (
                    <div className="mt-2">
                      <p className="text-vintage-sepia/70">
                        Locked - Requires specific relics
                      </p>
                      {missingNFTs.length > 0 && (
                        <p className="mt-1 text-sm text-vintage-gold">
                          Missing {missingNFTs.length} required{' '}
                          {missingNFTs.length === 1 ? 'relic' : 'relics'}
                        </p>
                      )}
                    </div>
                  )}

                  {scene.requiredNFTs.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {scene.requiredNFTs.map((templateId) => {
                        const isOwned = ownedTemplates.includes(templateId);
                        return (
                          <span
                            key={templateId}
                            className={`rounded border px-2 py-1 text-xs ${
                              isOwned
                                ? 'border-vintage-gold text-vintage-gold'
                                : 'border-vintage-sepia/30 text-vintage-sepia/50'
                            }`}
                          >
                            {isOwned ? '✓' : '🔒'} Relic #{templateId}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  {isUnlocked ? (
                    <button
                      onClick={() => setSelectedScene(scene)}
                      className="border-2 border-vintage-gold bg-transparent px-6 py-2 font-vintage text-vintage-sepia transition-all hover:bg-vintage-gold hover:text-vintage-dark"
                    >
                      View Scene
                    </button>
                  ) : (
                    <div className="px-6 py-2 text-4xl text-vintage-sepia/30">
                      🔒
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {scenes.every(scene => !scene.unlocked && scene.requiredNFTs.length > 0) && (
        <div className="mt-8 border-2 border-vintage-gold/30 bg-vintage-fade p-8 text-center">
          <p className="font-vintage text-vintage-sepia">
            Collect Future's Relic NFTs to unlock the story chapters
          </p>
          <p className="mt-2 text-sm text-vintage-sepia/70">
            Each relic holds a piece of the narrative waiting to be discovered
          </p>
        </div>
      )}
    </div>
  );
}
