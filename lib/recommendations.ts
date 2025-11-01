import type { BlendRecipe, NFTAsset, BlendRecommendation } from '@/types';
import { canCompleteBlend } from './api';

/**
 * Analyze blends and generate recommendations based on user's NFTs
 */
export function generateBlendRecommendations(
  blends: BlendRecipe[],
  userNFTs: NFTAsset[],
  completedBlendIds: string[] = []
): BlendRecommendation[] {
  const recommendations: BlendRecommendation[] = [];
  const now = Date.now() / 1000; // Convert to seconds

  for (const blend of blends) {
    // Skip if blend is not active
    if (!blend.is_active) continue;

    // Skip if blend has ended
    if (blend.end_time > 0 && blend.end_time < now) continue;

    // Skip if blend hasn't started
    if (blend.start_time > now) continue;

    // Skip if already completed
    if (completedBlendIds.includes(blend.blend_id)) continue;

    // Check if user can complete this blend
    const { canComplete, missing } = canCompleteBlend(blend, userNFTs);

    // Calculate priority score
    let priority = 0;
    let reason = '';

    if (canComplete) {
      priority = 100;
      reason = '✓ You can complete this blend right now!';
    } else {
      // Calculate how close user is to completing
      const totalIngredients = blend.ingredients.reduce((sum, ing) => sum + ing.amount, 0);
      const missingTotal = missing.reduce((sum, m) => sum + (m.needed - m.owned), 0);
      const completionPercentage = ((totalIngredients - missingTotal) / totalIngredients) * 100;

      priority = completionPercentage;

      if (completionPercentage > 75) {
        reason = `⚠ Almost there! Only ${missingTotal} item(s) needed.`;
      } else if (completionPercentage > 50) {
        reason = `⏳ Halfway there - ${missingTotal} more item(s) needed.`;
      } else if (completionPercentage > 0) {
        reason = `📋 In progress - ${missingTotal} item(s) still needed.`;
      } else {
        reason = `🔒 Not started - requires ${totalIngredients} specific items.`;
      }
    }

    // Boost priority for limited blends
    if (blend.max > 0) {
      const remaining = blend.max - blend.use_count;
      if (remaining < 10) {
        priority += 20;
        reason += ` ⚡ Only ${remaining} blends remaining!`;
      }
    }

    // Boost priority for time-limited blends
    if (blend.end_time > 0) {
      const hoursRemaining = (blend.end_time - now) / 3600;
      if (hoursRemaining < 24) {
        priority += 15;
        reason += ` ⏰ Expires in ${Math.round(hoursRemaining)} hours!`;
      }
    }

    recommendations.push({
      blend,
      canComplete,
      missingIngredients: missing,
      priority,
      reason,
    });
  }

  // Sort by priority (highest first)
  return recommendations.sort((a, b) => b.priority - a.priority);
}

/**
 * Get next suggested action for user
 */
export function getNextAction(recommendations: BlendRecommendation[]): {
  action: string;
  description: string;
  blend?: BlendRecommendation;
} {
  // Find first completable blend
  const completable = recommendations.find((rec) => rec.canComplete);
  
  if (completable) {
    return {
      action: 'Complete Blend',
      description: `You can complete "${parseDisplayData(completable.blend.display_data)?.name || 'a blend'}" right now!`,
      blend: completable,
    };
  }

  // Find closest blend to completion
  const closest = recommendations[0];
  
  if (closest && closest.priority > 50) {
    const displayData = parseDisplayData(closest.blend.display_data);
    return {
      action: 'Acquire Missing Items',
      description: `Get ${closest.missingIngredients.length} more item(s) to complete "${displayData?.name || 'a blend'}".`,
      blend: closest,
    };
  }

  return {
    action: 'Explore Collection',
    description: 'Check drops and marketplace to start building towards blends.',
  };
}

/**
 * Parse display_data IPFS JSON
 */
export function parseDisplayData(displayData: string): any {
  try {
    return JSON.parse(displayData);
  } catch {
    return null;
  }
}

/**
 * Group blends by storyline/category
 */
export function groupBlendsByStoryline(blends: BlendRecipe[]): Map<string, BlendRecipe[]> {
  const groups = new Map<string, BlendRecipe[]>();

  for (const blend of blends) {
    const displayData = parseDisplayData(blend.display_data);
    const category = displayData?.category || displayData?.storyline || 'Uncategorized';
    
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(blend);
  }

  return groups;
}
