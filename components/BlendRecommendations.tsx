'use client';

import React, { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { generateBlendRecommendations, getNextAction, parseDisplayData } from '@/lib/recommendations';
import { OldPaperCard } from './VintageOverlay';
import type { BlendRecommendation } from '@/types';

export const BlendRecommendations: React.FC = () => {
  const { blendRecipes, userNFTs, userProgress, isLoadingBlends } = useAppStore();

  const recommendations = useMemo(() => {
    if (!blendRecipes.length || !userNFTs.length) return [];
    return generateBlendRecommendations(
      blendRecipes,
      userNFTs,
      userProgress?.completedBlends || []
    );
  }, [blendRecipes, userNFTs, userProgress]);

  const nextAction = useMemo(() => {
    return getNextAction(recommendations);
  }, [recommendations]);

  if (isLoadingBlends) {
    return (
      <div className="text-center py-12">
        <div className="text-vintage-cream font-vintage text-xl animate-pulse">
          Analyzing blend possibilities...
        </div>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <OldPaperCard className="p-8 text-center">
        <h3 className="text-2xl font-vintage font-bold mb-4">No Blends Available</h3>
        <p className="text-lg opacity-70">
          Check back later or acquire NFTs from the Future's Relic collection to unlock blends.
        </p>
      </OldPaperCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Next Action Card */}
      <OldPaperCard className="p-6 border-4 border-vintage-gold">
        <div className="flex items-center gap-4">
          <div className="text-5xl">🎯</div>
          <div className="flex-1">
            <h3 className="text-2xl font-vintage font-bold text-vintage-sepia mb-2">
              {nextAction.action}
            </h3>
            <p className="text-lg opacity-80">{nextAction.description}</p>
          </div>
        </div>
      </OldPaperCard>

      {/* Recommendations List */}
      <div>
        <h2 className="text-3xl font-vintage font-bold text-vintage-cream mb-6 flex items-center gap-3">
          <span>📜</span>
          <span>Available Blends</span>
          <span className="text-xl opacity-70">({recommendations.length})</span>
        </h2>

        <div className="space-y-4">
          {recommendations.slice(0, 10).map((rec) => (
            <BlendRecommendationCard key={rec.blend.blend_id} recommendation={rec} />
          ))}
        </div>
      </div>
    </div>
  );
};

const BlendRecommendationCard: React.FC<{ recommendation: BlendRecommendation }> = ({
  recommendation,
}) => {
  const { blend, canComplete, missingIngredients, priority, reason } = recommendation;
  const displayData = parseDisplayData(blend.display_data);

  return (
    <OldPaperCard
      className={`
        p-6 transition-all hover:scale-[1.02] cursor-pointer
        ${canComplete ? 'border-4 border-green-600 shadow-2xl' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Blend Name */}
          <h3 className="text-2xl font-vintage font-bold text-vintage-sepia mb-2">
            {displayData?.name || `Blend #${blend.blend_id}`}
          </h3>

          {/* Description */}
          {displayData?.description && (
            <p className="text-sm opacity-70 mb-3 italic">
              {displayData.description}
            </p>
          )}

          {/* Status/Reason */}
          <div className="text-lg mb-4 font-medium">{reason}</div>

          {/* Ingredients */}
          <div className="space-y-2">
            <div className="text-sm font-bold opacity-70">Required Ingredients:</div>
            {blend.ingredients.map((ingredient, idx) => {
              const missing = missingIngredients.find(
                (m) => m.ingredient.template_id === ingredient.template_id
              );

              return (
                <div
                  key={idx}
                  className={`
                    flex items-center gap-3 text-sm
                    ${missing ? 'opacity-50' : 'text-green-700 font-bold'}
                  `}
                >
                  <span>{missing ? '❌' : '✅'}</span>
                  <span>
                    {ingredient.amount}x {ingredient.template_id ? `Template #${ingredient.template_id}` : ingredient.schema_name || 'Any NFT'}
                  </span>
                  {missing && (
                    <span className="text-red-600 font-bold">
                      (Need {missing.needed - missing.owned} more)
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Blend Stats */}
          <div className="mt-4 flex gap-6 text-sm opacity-70">
            {blend.max > 0 && (
              <div>
                <strong>Remaining:</strong> {blend.max - blend.use_count}/{blend.max}
              </div>
            )}
            {blend.end_time > 0 && (
              <div>
                <strong>Ends:</strong> {new Date(blend.end_time * 1000).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Priority Badge */}
        <div className="text-center min-w-[80px]">
          <div
            className={`
              text-4xl font-bold font-vintage mb-2
              ${priority >= 100 ? 'text-green-600' : priority >= 75 ? 'text-yellow-600' : 'text-gray-600'}
            `}
          >
            {Math.round(priority)}
          </div>
          <div className="text-xs opacity-70">Priority</div>
        </div>
      </div>

      {/* Action Button */}
      {canComplete && (
        <div className="mt-6 pt-4 border-t-2 border-vintage-sepia">
          <a
            href={`https://neftyblocks.com/collection/futuresrelic/blends/${blend.blend_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              block w-full py-3 bg-green-700 text-white text-center
              font-vintage font-bold text-lg
              hover:bg-green-600 transition-all
              border-2 border-green-800
            "
          >
            Complete This Blend on NeftyBlocks →
          </a>
        </div>
      )}
    </OldPaperCard>
  );
};
