'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { RelicCard } from './RelicCard';
import { NFTAsset } from '@/types';

export function BlendLab() {
  const { wallet, blendRecipes, completeBlend, progress } = useGame();
  const [selectedNFTs, setSelectedNFTs] = useState<NFTAsset[]>([]);
  const [isBlending, setIsBlending] = useState(false);
  const [blendResult, setBlendResult] = useState<string | null>(null);

  const handleNFTSelect = (nft: NFTAsset) => {
    if (selectedNFTs.find(n => n.asset_id === nft.asset_id)) {
      setSelectedNFTs(selectedNFTs.filter(n => n.asset_id !== nft.asset_id));
    } else if (selectedNFTs.length < 3) {
      setSelectedNFTs([...selectedNFTs, nft]);
    }
  };

  const findMatchingRecipe = () => {
    const selectedTemplates = selectedNFTs.map(nft => nft.template_id).sort();
    
    return blendRecipes.find(recipe => {
      const requiredTemplates = [...recipe.requiredTemplates].sort();
      return JSON.stringify(selectedTemplates) === JSON.stringify(requiredTemplates);
    });
  };

  const handleBlend = async () => {
    const matchingRecipe = findMatchingRecipe();
    
    if (!matchingRecipe) {
      alert('These relics do not form a valid combination. Try different artifacts.');
      return;
    }

    setIsBlending(true);
    setBlendResult(null);

    // Simulate blend process
    await new Promise(resolve => setTimeout(resolve, 2000));

    completeBlend(matchingRecipe.id);
    setBlendResult(matchingRecipe.resultName);
    setIsBlending(false);
    setSelectedNFTs([]);
  };

  if (!wallet.isConnected) {
    return (
      <div className="text-center">
        <div className="inline-block border-2 border-vintage-gold bg-vintage-dark p-12">
          <p className="font-vintage text-xl text-vintage-sepia">
            Connect your wallet to access the Blend Laboratory
          </p>
        </div>
      </div>
    );
  }

  const matchingRecipe = findMatchingRecipe();

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="font-vintage text-3xl text-vintage-sepia">
          The Blend Laboratory
        </h2>
        <p className="mt-2 text-vintage-sepia/70">
          Combine three relics to forge something greater
        </p>
      </div>

      {/* Blend Result */}
      {blendResult && (
        <div className="mb-8 animate-fade-in border-2 border-vintage-gold bg-vintage-dark p-8 text-center">
          <div className="text-2xl text-vintage-gold">✨</div>
          <h3 className="mt-4 font-vintage text-2xl text-vintage-sepia">
            Blend Successful!
          </h3>
          <p className="mt-2 text-vintage-gold">{blendResult}</p>
          <p className="mt-4 text-sm text-vintage-sepia/70">
            A new artifact has been forged from the convergence of ancient powers.
          </p>
        </div>
      )}

      {/* Selection Area */}
      <div className="mb-8 border-2 border-vintage-gold bg-vintage-fade p-8">
        <h3 className="mb-4 text-center font-vintage text-xl text-vintage-sepia">
          Selected Relics ({selectedNFTs.length}/3)
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="aspect-square border-2 border-dashed border-vintage-sepia/30 bg-vintage-dark/50"
            >
              {selectedNFTs[index] ? (
                <RelicCard
                  nft={selectedNFTs[index]}
                  onClick={() => handleNFTSelect(selectedNFTs[index])}
                  selected
                />
              ) : (
                <div className="flex h-full items-center justify-center text-vintage-sepia/50">
                  Empty Slot
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recipe Preview */}
        {matchingRecipe && (
          <div className="mt-6 border-t-2 border-vintage-gold/30 pt-6">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider text-vintage-gold">
                Valid Recipe Detected
              </p>
              <p className="mt-2 font-vintage text-lg text-vintage-sepia">
                {matchingRecipe.name}
              </p>
              <p className="mt-1 text-sm text-vintage-sepia/70">
                {matchingRecipe.description}
              </p>
            </div>
          </div>
        )}

        {/* Blend Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleBlend}
            disabled={selectedNFTs.length !== 3 || isBlending}
            className="border-2 border-vintage-gold bg-vintage-dark px-8 py-3 font-vintage text-lg text-vintage-sepia transition-all hover:bg-vintage-gold hover:text-vintage-dark disabled:opacity-50 disabled:hover:bg-vintage-dark disabled:hover:text-vintage-sepia"
          >
            {isBlending ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">Forging...</span>
              </span>
            ) : (
              'Begin Blend'
            )}
          </button>
        </div>
      </div>

      {/* Available NFTs */}
      <div>
        <h3 className="mb-4 font-vintage text-xl text-vintage-sepia">
          Available Relics
        </h3>
        {wallet.nfts.length === 0 ? (
          <div className="border-2 border-vintage-gold/30 bg-vintage-dark p-8 text-center text-vintage-sepia/70">
            No relics available for blending
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wallet.nfts.map((nft) => (
              <RelicCard
                key={nft.asset_id}
                nft={nft}
                onClick={() => handleNFTSelect(nft)}
                selected={!!selectedNFTs.find(n => n.asset_id === nft.asset_id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Blends */}
      {progress.completedBlends.length > 0 && (
        <div className="mt-8 border-t-2 border-vintage-gold/30 pt-8">
          <h3 className="mb-4 font-vintage text-xl text-vintage-sepia">
            Completed Blends
          </h3>
          <div className="space-y-2">
            {progress.completedBlends.map((blendId) => {
              const recipe = blendRecipes.find(r => r.id === blendId);
              return recipe ? (
                <div key={blendId} className="border-l-4 border-vintage-gold bg-vintage-fade p-4">
                  <p className="font-vintage text-vintage-sepia">{recipe.name}</p>
                  <p className="text-sm text-vintage-sepia/70">{recipe.description}</p>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
