'use client';

import React from 'react';
import Image from 'next/image';
import { NFTAsset } from '@/types';
import { waxService } from '@/services/waxService';

interface RelicCardProps {
  nft: NFTAsset;
  onClick?: () => void;
  selected?: boolean;
}

export function RelicCard({ nft, onClick, selected }: RelicCardProps) {
  const name = nft.name || nft.data?.name || 'Unknown Relic';
  const image = nft.img || nft.data?.img || '';
  const rarity = nft.data?.rarity || 'common';
  
  const imageUrl = waxService.getIpfsUrl(image);

  const rarityColors = {
    common: 'border-gray-500',
    rare: 'border-blue-500',
    legendary: 'border-vintage-gold',
    mythic: 'border-purple-500',
  };

  const borderColor = rarityColors[rarity as keyof typeof rarityColors] || rarityColors.common;

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer border-2 ${borderColor} ${
        selected ? 'ring-4 ring-vintage-gold' : ''
      } bg-vintage-dark p-4 transition-all hover:scale-105 hover:shadow-lg hover:shadow-vintage-gold/30`}
    >
      {/* Relic Image */}
      <div className="relative mb-3 aspect-square overflow-hidden bg-vintage-fade">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-vintage-sepia/50">
            No Image
          </div>
        )}
        
        {/* Vintage photo corner effect */}
        <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-vintage-sepia opacity-50" />
        <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-vintage-sepia opacity-50" />
        <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-vintage-sepia opacity-50" />
        <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-vintage-sepia opacity-50" />
      </div>

      {/* Relic Info */}
      <div className="text-center">
        <h3 className="font-vintage text-sm text-vintage-sepia">{name}</h3>
        <p className="mt-1 text-xs uppercase tracking-wider text-vintage-gold">
          {rarity}
        </p>
        <p className="mt-1 text-xs text-vintage-sepia/70">
          #{nft.asset_id}
        </p>
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-vintage-gold text-vintage-dark">
          ✓
        </div>
      )}
    </div>
  );
}
