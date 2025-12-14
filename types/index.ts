// Core Types for Future's Relic

export interface WAXAccount {
  accountName: string;
  permission: string;
  publicKey: string;
}

export interface NFTAsset {
  asset_id: string;
  template_id: string;
  schema_name: string;
  name: string;
  img: string;
  data: Record<string, any>;
  collection: {
    collection_name: string;
    name: string;
    img: string;
  };
}

export interface BlendRecipe {
  blend_id: string;
  collection_name: string;
  contract: string;
  is_active: boolean;
  start_time: number;
  end_time: number;
  max: number;
  use_count: number;
  ingredients: BlendIngredient[];
  display_data: string;
  security_id: number;
  target_template_id?: string;
}

export interface BlendIngredient {
  collection_name: string;
  schema_name?: string;
  template_id?: string;
  amount: number;
  effect: {
    type: string;
    payload?: any;
  };
  display_data?: string;
}

export interface Drop {
  drop_id: string;
  collection_name: string;
  assets_to_mint: any[];
  listing_price: string;
  settlement_symbol: string;
  price: number;
  display_data: string;
  auth_required: boolean;
  account_limit: number;
  account_limit_cooldown: number;
  max_claimable: number;
  current_claimed: number;
  start_time: number;
  end_time: number;
}

export interface Pack {
  pack_id: string;
  collection_name: string;
  display_data: string;
  unlock_time: number;
  pack_template_id: string;
}

export interface StoryScene {
  id: string;
  title: string;
  description?: string;
  content: string;
  requiredNFTs: string[]; // template IDs
  unlocked: boolean;
  imageUrl?: string;
  order?: number;
  blend_id?: string; // Optional link to blend that unlocks this scene
  cinematicEffect?: 'fade' | 'flicker' | 'none';
}

export interface BlendRecommendation {
  blend: BlendRecipe;
  canComplete: boolean;
  missingIngredients: {
    ingredient: BlendIngredient;
    owned: number;
    needed: number;
  }[];
  priority: number; // Higher = more recommended
  reason: string;
}

export interface UserProgress {
  accountName: string;
  unlockedScenes: string[];
  completedBlends: string[];
  lastUpdated: number;
}

// Story/Game specific types (different from API types)
export interface StoryBlendRecipe {
  id: string;
  name: string;
  requiredTemplates: string[];
  resultTemplateId: string;
  resultName: string;
  resultImage: string;
  description: string;
}

export interface WalletState {
  isConnected: boolean;
  accountName: string | null;
  nfts: NFTAsset[];
}

export interface GameProgress {
  unlockedScenes: string[];
  completedBlends: string[];
  discoveredRelics: string[];
  currentChapter: number;
}