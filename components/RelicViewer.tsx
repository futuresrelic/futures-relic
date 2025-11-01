'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { FilmFrame, OldPaperCard } from './VintageOverlay';

export const RelicViewer: React.FC = () => {
  const { userNFTs, isLoadingNFTs } = useAppStore();
  const [selectedRelic, setSelectedRelic] = useState<string | null>(null);

  if (isLoadingNFTs) {
    return (
      <div className="text-center py-12">
        <div className="text-vintage-cream font-vintage text-xl animate-pulse">
          Discovering your relics...
        </div>
      </div>
    );
  }

  if (!userNFTs.length) {
    return (
      <OldPaperCard className="p-8 text-center">
        <h3 className="text-2xl font-vintage font-bold mb-4">No Relics Found</h3>
        <p className="text-lg opacity-70 mb-6">
          You don't own any Future's Relic NFTs yet.
        </p>
        <a
          href="https://neftyblocks.com/collection/futuresrelic"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block px-6 py-3 bg-vintage-gold text-vintage-darkBrown
            font-vintage font-bold border-2 border-vintage-sepia
            hover:bg-vintage-cream transition-all
          "
        >
          Explore Collection
        </a>
      </OldPaperCard>
    );
  }

  const selectedNFT = selectedRelic
    ? userNFTs.find((nft) => nft.asset_id === selectedRelic)
    : null;

  return (
    <div>
      <h2 className="text-3xl font-vintage font-bold text-vintage-cream mb-6 flex items-center gap-3">
        <span>🔮</span>
        <span>Your Relics</span>
        <span className="text-xl opacity-70">({userNFTs.length})</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        {userNFTs.map((nft) => (
          <button
            key={nft.asset_id}
            onClick={() => setSelectedRelic(nft.asset_id)}
            className={`
              relative group cursor-pointer transition-all
              ${selectedRelic === nft.asset_id ? 'scale-110 z-10' : 'hover:scale-105'}
            `}
          >
            <FilmFrame className="aspect-square">
              <div className="relative w-full h-full bg-vintage-sepia flex items-center justify-center">
                {nft.img ? (
                  <img
                    src={`https://ipfs.io/ipfs/${nft.img}`}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-6xl">🔮</div>
                )}
                {selectedRelic === nft.asset_id && (
                  <div className="absolute inset-0 border-4 border-vintage-gold animate-pulse" />
                )}
              </div>
            </FilmFrame>
            <div className="mt-2 text-center text-sm font-vintage text-vintage-cream truncate">
              {nft.name}
            </div>
          </button>
        ))}
      </div>

      {selectedNFT && (
        <div className="animate-fade-in">
          <OldPaperCard className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <FilmFrame>
                  <div className="relative w-full aspect-square bg-vintage-sepia flex items-center justify-center">
                    {selectedNFT.img ? (
                      <img
                        src={`https://ipfs.io/ipfs/${selectedNFT.img}`}
                        alt={selectedNFT.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-9xl">🔮</div>
                    )}
                  </div>
                </FilmFrame>
              </div>

              <div className="flex-1">
                <h3 className="text-3xl font-vintage font-bold text-vintage-sepia mb-4">
                  {selectedNFT.name}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex gap-2">
                    <span className="font-bold opacity-70">Asset ID:</span>
                    <span className="font-mono">{selectedNFT.asset_id}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold opacity-70">Template ID:</span>
                    <span className="font-mono">{selectedNFT.template_id}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold opacity-70">Schema:</span>
                    <span>{selectedNFT.schema_name}</span>
                  </div>
                </div>

                {selectedNFT.data && Object.keys(selectedNFT.data).length > 0 && (
                  <div>
                    <h4 className="text-xl font-vintage font-bold mb-3">Attributes:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedNFT.data).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-vintage-cream bg-opacity-50 p-3 rounded"
                        >
                          <div className="text-sm opacity-70 capitalize">
                            {key.replace(/_/g, ' ')}
                          </div>
                          <div className="font-bold">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <a
                    href={`https://wax.atomichub.io/explorer/asset/wax-mainnet/${selectedNFT.asset_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      px-4 py-2 bg-vintage-sepia text-vintage-cream
                      font-vintage border-2 border-vintage-darkBrown
                      hover:bg-opacity-80 transition-all
                    "
                  >
                    View on AtomicHub
                  </a>
                  <button
                    onClick={() => setSelectedRelic(null)}
                    className="
                      px-4 py-2 bg-vintage-rust text-vintage-cream
                      font-vintage border-2 border-vintage-sepia
                      hover:bg-opacity-80 transition-all
                    "
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </OldPaperCard>
        </div>
      )}
    </div>
  );
};