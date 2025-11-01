# Future's Relic - Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: http://localhost:3000

### 4. Connect Wallet
Click "Connect WAX Wallet" and login with your WAX Cloud Wallet

## What You'll See

### Without NFTs
- Empty relic collection
- Locked story scenes
- Blend lab (no items to blend)

### With Future's Relic NFTs
- Your NFTs displayed in "My Relics" tab
- Story scenes unlock automatically based on owned NFTs
- Blend lab allows combining three relics

## Customizing for Your Collection

### Step 1: Change Collection Name
Edit `services/waxService.ts`:
```typescript
collectionName: string = 'YOUR_COLLECTION_NAME'
```

### Step 2: Add Your Story Scenes
Edit `context/GameContext.tsx` - find `initialScenes`:
```typescript
{
  id: 'scene_1',
  title: 'Your Scene Title',
  content: 'Your narrative...',
  requiredNFTs: ['YOUR_TEMPLATE_IDS'],
  unlocked: false,
}
```

### Step 3: Create Blend Recipes
Edit `context/GameContext.tsx` - find `initialBlendRecipes`:
```typescript
{
  id: 'blend_1',
  name: 'Your Recipe',
  requiredTemplates: ['TEMPLATE_1', 'TEMPLATE_2', 'TEMPLATE_3'],
  resultName: 'Result Name',
  description: 'Recipe description',
}
```

## Admin Panel Access

1. Click "⚙️ Admin" button in header
2. Default password: `futuresrelic2025`
3. Add scenes and blend recipes via forms
4. Note: Currently logs to console - add database integration for production

## Finding Template IDs

### Method 1: AtomicHub
1. Visit: https://wax.atomichub.io/explorer/collection/YOUR_COLLECTION
2. Click on any NFT
3. Look for "Template ID" in details

### Method 2: Via App
1. Connect wallet with NFTs
2. Open browser console (F12)
3. Check `wallet.nfts` in GameContext
4. Template IDs are in the `template_id` field

## Testing the Experience

### Test Flow 1: Story Unlocking
1. Add a scene with `requiredNFTs: []` (no requirements)
2. Connect wallet
3. Scene should appear unlocked in Story tab

### Test Flow 2: NFT-Gated Content
1. Add a scene with your NFT's template ID in `requiredNFTs`
2. Connect wallet that owns that NFT
3. Scene should auto-unlock

### Test Flow 3: Blending
1. Create a blend recipe with 3 template IDs you own
2. Go to Blend Lab tab
3. Select those 3 NFTs
4. Click "Begin Blend"
5. See success message

## Common Issues

### "No relics found"
- Your wallet doesn't own NFTs from the configured collection
- Check collection name matches exactly

### Scenes not unlocking
- Template IDs in scene requirements must match exactly
- Check console for owned template IDs vs required template IDs

### Blend not working
- All 3 template IDs must match a recipe exactly
- Order doesn't matter, but all 3 must be present

## Production Checklist

- [ ] Update collection name
- [ ] Add your story scenes with correct template IDs
- [ ] Create blend recipes
- [ ] Test with real wallet and NFTs
- [ ] Change admin password
- [ ] Add database integration (Firebase/Supabase)
- [ ] Configure proper authentication
- [ ] Update branding and colors
- [ ] Build and deploy: `npm run build`

## Next Steps

1. ✅ Get it running locally
2. ✅ Connect your wallet
3. ✅ Customize for your collection
4. ✅ Add your story content
5. ✅ Test all features
6. 🚀 Deploy to production

## Need Help?

- WAX Blockchain: https://developer.wax.io/
- AtomicHub API Docs: https://atomichub.io/api
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev/

---

Happy building! 🎭
