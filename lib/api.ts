import axios from 'axios';
import type { NFTAsset, BlendRecipe, Drop, Pack } from '@/types';

const COLLECTION_NAME = 'futuresrelic';

// Use Next.js API routes as proxy to avoid CORS
export async function fetchUserNFTs(accountName: string): Promise<NFTAsset[]> {
  try {
    const response = await axios.get('/api/nfts', {
      params: {
        owner: accountName,
        collection_name: COLLECTION_NAME,
        limit: 1000,
      },
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}

// Fetch all blend recipes for the collection
export async function fetchBlendRecipes(): Promise<BlendRecipe[]> {
  try {
    const response = await axios.post('/api/blends', {
      collection: COLLECTION_NAME,
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching blend recipes:', error);
    return [];
  }
}

// Fetch drops for the collection
export async function fetchDrops(): Promise<Drop[]> {
  try {
    const response = await axios.post('/api/drops', {
      collection: COLLECTION_NAME,
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching drops:', error);
    return [];
  }
}

// Fetch packs for the collection
export async function fetchPacks(): Promise<Pack[]> {
  try {
    const response = await axios.post('/api/packs', {
      collection: COLLECTION_NAME,
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching packs:', error);
    return [];
  }
}

// Get template information
export async function fetchTemplate(templateId: string): Promise<any> {
  try {
    const response = await axios.get(`/api/templates/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching template:', error);
    return null;
  }
}

// Check if user can complete a blend
export function canCompleteBlend(
  blend: BlendRecipe,
  userNFTs: NFTAsset[]
): { canComplete: boolean; missing: any[] } {
  const missing: any[] = [];
  
  // Create a pool of available NFTs (clone array so we can track usage)
  const availableNFTs = [...userNFTs];
  const usedNFTIds = new Set<string>();

  for (const ingredient of blend.ingredients) {
    let matchingNFTs: NFTAsset[] = [];

    if (ingredient.template_id) {
      // Template-specific ingredient
      const ingredientTemplateId = String(ingredient.template_id);
      matchingNFTs = availableNFTs.filter(
        nft => String(nft.template_id) === ingredientTemplateId && !usedNFTIds.has(nft.asset_id)
      );
    } else if (ingredient.schema_name) {
      // Schema-based ingredient (any NFT from this schema)
      matchingNFTs = availableNFTs.filter(
        nft => nft.schema_name === ingredient.schema_name && !usedNFTIds.has(nft.asset_id)
      );
    } else if (ingredient.collection_name) {
      // Collection-based ingredient (any NFT from collection)
      matchingNFTs = availableNFTs.filter(
        nft => nft.collection.collection_name === ingredient.collection_name && !usedNFTIds.has(nft.asset_id)
      );
    }

    // Check if we have enough
    const needed = ingredient.amount;
    const owned = matchingNFTs.length;

    if (owned < needed) {
      missing.push({
        ingredient,
        owned,
        needed,
      });
    } else {
      // Mark the first N matching NFTs as "used" so they can't be double-counted
      for (let i = 0; i < needed; i++) {
        usedNFTIds.add(matchingNFTs[i].asset_id);
      }
    }
  }

  return {
    canComplete: missing.length === 0,
    missing,
  };
}
