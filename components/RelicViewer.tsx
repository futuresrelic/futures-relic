'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { FilmFrame, OldPaperCard } from './VintageOverlay';

// Helper to get template ID from various possible locations
const getTemplateId = (nft: any): string => {
  return nft.template_id || nft.template?.template_id || nft.data?.template_id || 'no-template';
};

// Helper to get image/video from NFT
const getMediaUrl = (nft: any): { type: 'image' | 'video', url: string } | null => {
  // Check for video first (priority)
  const video = nft.data?.video || nft.video;
  if (video) {
    const videoUrl = video.startsWith('http') ? video : `https://ipfs.io/ipfs/${video}`;
    return { type: 'video', url: videoUrl };
  }

  // Then check for image
  const img = nft.img || nft.data?.img;
  if (img) {
    const imgUrl = img.startsWith('http') ? img : `https://ipfs.io/ipfs/${img}`;
    return { type: 'image', url: imgUrl };
  }

  return null;
};

// Helper to get NFT name
const getNFTName = (nft: any): string => {
  return nft.name || nft.data?.name || 'Unknown Relic';
};

export const RelicViewer: React.FC = () => {
  const { userNFTs, isLoadingNFTs } = useAppStore();
  const [selectedRelic, setSelectedRelic] = useState<string | null>(null);
  const [groupByTemplate, setGroupByTemplate] = useState(true);

  const groupedNFTs = useMemo(() => {
    if (!groupByTemplate) return null;

    const groups = new Map<string, typeof userNFTs>();
    userNFTs.forEach(nft => {
      const key = getTemplateId(nft);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(nft);
    });
    return groups;
  }, [userNFTs, groupByTemplate]);

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

  const displayNFTs = groupByTemplate && groupedNFTs
    ? Array.from(groupedNFTs.values()).map(group => group[0])
    : userNFTs;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-vintage font-bold text-vintage-cream flex items-center gap-3">
          <span>🔮</span>
          <span>Your Relics</span>
          <span className="text-xl opacity-70">
            ({groupByTemplate ? groupedNFTs?.size : userNFTs.length})
          </span>
        </h2>
        
        <button
          onClick={() => setGroupByTemplate(!groupByTemplate)}
          className="
            px-4 py-2 bg-vintage-gold text-vintage-darkBrown
            font-vintage font-bold border-2 border-vintage-sepia
            hover:bg-vintage-cream transition-all
          "
        >
          {groupByTemplate ? 'Show All' : 'Group by Template'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {displayNFTs.map((nft) => {
          const templateId = getTemplateId(nft);
          const count = groupByTemplate && groupedNFTs
            ? groupedNFTs.get(templateId)?.length || 1
            : 1;
          const media = getMediaUrl(nft);
          const name = getNFTName(nft);

          return (
            <button
              key={nft.asset_id}
              onClick={() => setSelectedRelic(nft.asset_id)}
              className={`
                relative group cursor-pointer transition-all
                ${selectedRelic === nft.asset_id ? 'scale-105 z-10' : 'hover:scale-105'}
              `}
            >
              <FilmFrame className="w-full" style={{ aspectRatio: '750/1050' }}>
                <div className="relative w-full h-full bg-vintage-sepia flex items-center justify-center">
                  {media ? (
                    media.type === 'video' ? (
                      <video
                        src={media.url}
                        className="w-full h-full object-contain"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={media.url}
                        alt={name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )
                  ) : (
                    <div className="text-6xl">🔮</div>
                  )}
                  {selectedRelic === nft.asset_id && (
                    <div className="absolute inset-0 border-4 border-vintage-gold animate-pulse" />
                  )}
                  {groupByTemplate && count > 1 && (
                    <div className="absolute top-2 right-2 bg-vintage-gold text-vintage-darkBrown font-bold px-3 py-1 rounded-full border-2 border-vintage-sepia">
                      ×{count}
                    </div>
                  )}
                </div>
              </FilmFrame>
              <div className="mt-2 text-center text-sm font-vintage text-vintage-cream truncate">
                {name}
              </div>
            </button>
          );
        })}
      </div>

      {selectedNFT && (
        <div className="animate-fade-in">
          <OldPaperCard className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <FilmFrame style={{ aspectRatio: '750/1050' }}>
                  <div className="relative w-full h-full bg-vintage-sepia flex items-center justify-center">
                    {(() => {
                      const media = getMediaUrl(selectedNFT);
                      if (!media) return <div className="text-9xl">🔮</div>;

                      if (media.type === 'video') {
                        return (
                          <video
                            src={media.url}
                            className="w-full h-full object-contain"
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        );
                      }

                      return (
                        <img
                          src={media.url}
                          alt={getNFTName(selectedNFT)}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      );
                    })()}
                  </div>
                </FilmFrame>
              </div>

              <div className="flex-1">
                <h3 className="text-3xl font-vintage font-bold text-vintage-sepia mb-4">
                  {getNFTName(selectedNFT)}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex gap-2">
                    <span className="font-bold opacity-70">Asset ID:</span>
                    <span className="font-mono">{selectedNFT.asset_id}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold opacity-70">Template ID:</span>
                    <span className="font-mono">
                      {getTemplateId(selectedNFT)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold opacity-70">Schema:</span>
                    <span>{selectedNFT.schema_name || 'N/A'}</span>
                  </div>
                  {groupByTemplate && groupedNFTs && (
                    <div className="flex gap-2">
                      <span className="font-bold opacity-70">You own:</span>
                      <span className="font-bold text-vintage-gold">
                        {groupedNFTs.get(getTemplateId(selectedNFT))?.length || 1}
                      </span>
                    </div>
                  )}
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