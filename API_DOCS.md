# API & Data Structure Documentation

## Table of Contents
1. [WAX Service API](#wax-service-api)
2. [Data Structures](#data-structures)
3. [Game State Management](#game-state-management)
4. [AtomicHub Integration](#atomichub-integration)
5. [Local Storage](#local-storage)

---

## WAX Service API

Located in: `services/waxService.ts`

### Methods

#### `initialize()`
Initializes the WAX JS SDK.
```typescript
await waxService.initialize();
```
**Returns:** `Promise<void>`

#### `login()`
Opens WAX Cloud Wallet login popup.
```typescript
const accountName = await waxService.login();
```
**Returns:** `Promise<string>` - Account name
**Throws:** Error if login fails

#### `isAutoLoginAvailable()`
Checks if user has previously logged in.
```typescript
const available = await waxService.isAutoLoginAvailable();
```
**Returns:** `Promise<boolean>`

#### `fetchUserNFTs(accountName, collectionName)`
Fetches all NFTs owned by user in specified collection.
```typescript
const nfts = await waxService.fetchUserNFTs('myaccount.wam', 'futuresrelic');
```
**Parameters:**
- `accountName` (string): WAX account name
- `collectionName` (string): Collection to query (default: 'futuresrelic')

**Returns:** `Promise<NFTAsset[]>`

#### `fetchTemplateInfo(templateId)`
Gets detailed info about a specific template.
```typescript
const template = await waxService.fetchTemplateInfo('123456');
```
**Parameters:**
- `templateId` (string): Template ID

**Returns:** `Promise<any>` - Template data or null

#### `fetchCollectionStats(collectionName)`
Gets statistics for a collection.
```typescript
const stats = await waxService.fetchCollectionStats('futuresrelic');
```
**Returns:** `Promise<any>` - Collection stats or null

#### `getIpfsUrl(ipfsHash)`
Converts IPFS hash to accessible URL.
```typescript
const url = waxService.getIpfsUrl('QmXxxx...');
```
**Returns:** `string` - Full IPFS URL

---

## Data Structures

### NFTAsset
Represents an NFT from AtomicHub API.

```typescript
interface NFTAsset {
  asset_id: string;           // Unique asset ID
  template_id: string;        // Template this asset was minted from
  name: string;               // Asset name
  collection: {
    collection_name: string;  // Collection it belongs to
  };
  data: {                     // Mutable data
    name?: string;
    img?: string;             // IPFS image hash
    rarity?: string;
    description?: string;
    [key: string]: any;
  };
  immutable_data?: {          // Immutable data set at mint
    name?: string;
    img?: string;
    [key: string]: any;
  };
}
```

**Example:**
```json
{
  "asset_id": "1099511627776",
  "template_id": "123456",
  "name": "Ancient Gear",
  "collection": {
    "collection_name": "futuresrelic"
  },
  "data": {
    "name": "Ancient Gear",
    "img": "QmXxxx...",
    "rarity": "legendary"
  }
}
```

### RelicData
Processed NFT data for display.

```typescript
interface RelicData {
  id: string;                 // Asset ID
  name: string;               // Display name
  image: string;              // Full IPFS URL
  description: string;        // Description text
  rarity: 'common' | 'rare' | 'legendary' | 'mythic';
  templateId: string;         // Template ID
  owned: boolean;             // Whether user owns this
}
```

### StoryScene
Represents a narrative scene.

```typescript
interface StoryScene {
  id: string;                 // Unique scene identifier
  title: string;              // Scene title
  content: string;            // Narrative text (supports markdown)
  requiredNFTs: string[];     // Template IDs required to unlock
  unlocked: boolean;          // Whether scene is accessible
  image?: string;             // Optional scene image URL
  cinematicEffect?: 'fade' | 'flicker' | 'slide';
}
```

**Example:**
```typescript
{
  id: 'scene_1',
  title: 'The Discovery',
  content: 'In the depths of an abandoned archive...',
  requiredNFTs: ['123456', '123457'],
  unlocked: false,
  cinematicEffect: 'fade'
}
```

### BlendRecipe
Defines a combination recipe.

```typescript
interface BlendRecipe {
  id: string;                 // Unique recipe ID
  name: string;               // Recipe name
  requiredTemplates: string[];// Exactly 3 template IDs needed
  resultTemplateId: string;   // Template ID of result (simulated)
  resultName: string;         // Name of resulting artifact
  resultImage: string;        // Image of result
  description: string;        // Recipe description
}
```

**Example:**
```typescript
{
  id: 'blend_1',
  name: 'The Chronometer',
  requiredTemplates: ['123456', '123457', '123458'],
  resultTemplateId: '999999',
  resultName: 'Eternal Chronometer',
  resultImage: '/relics/chronometer.png',
  description: 'Combine three gears to forge a device that transcends time.'
}
```

### GameProgress
Tracks user's progress.

```typescript
interface GameProgress {
  unlockedScenes: string[];   // IDs of unlocked scenes
  completedBlends: string[];  // IDs of completed blends
  discoveredRelics: string[]; // IDs of discovered relics
  currentChapter: number;     // Current story chapter
}
```

**Storage:** LocalStorage key `futuresrelic_progress`

### WalletState
Current wallet connection state.

```typescript
interface WalletState {
  isConnected: boolean;       // Whether wallet is connected
  accountName: string | null; // WAX account name
  nfts: NFTAsset[];          // Owned NFTs
}
```

---

## Game State Management

### Context: GameContext
Located in: `context/GameContext.tsx`

Provides global state and actions via React Context.

#### State
```typescript
{
  wallet: WalletState;
  progress: GameProgress;
  scenes: StoryScene[];
  blendRecipes: BlendRecipe[];
  isLoading: boolean;
}
```

#### Actions
```typescript
{
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  unlockScene: (sceneId: string) => void;
  completeBlend: (blendId: string) => void;
  discoverRelic: (relicId: string) => void;
}
```

### Usage in Components
```typescript
import { useGame } from '@/context/GameContext';

function MyComponent() {
  const { wallet, scenes, connectWallet } = useGame();
  
  // Use state and actions
}
```

---

## AtomicHub Integration

### Base URL
```
https://wax.api.atomicassets.io/atomicassets/v1/
```

### Endpoints Used

#### Get User Assets
```
GET /assets?owner={account}&collection_name={collection}
```
**Query Parameters:**
- `owner`: WAX account name
- `collection_name`: Collection filter
- `page`: Page number (default: 1)
- `limit`: Results per page (max: 1000)
- `order`: Sort order (asc/desc)
- `sort`: Sort field (default: asset_id)

**Response:**
```json
{
  "success": true,
  "data": [NFTAsset, ...],
  "query_time": 123
}
```

#### Get Template
```
GET /templates/{collection_name}/{template_id}
```

#### Get Collection Stats
```
GET /collections/{collection_name}/stats
```

### Rate Limits
- Standard: 4 requests/second
- Burst: 10 requests/second
- Implement caching to avoid limits

### Error Handling
```typescript
try {
  const nfts = await waxService.fetchUserNFTs(account, collection);
} catch (error) {
  if (error.response?.status === 429) {
    // Rate limited
  } else if (error.response?.status === 404) {
    // Not found
  } else {
    // Other error
  }
}
```

---

## Local Storage

### Keys Used

#### `futuresrelic_progress`
Stores game progress.

**Structure:**
```json
{
  "unlockedScenes": ["scene_1", "scene_2"],
  "completedBlends": ["blend_1"],
  "discoveredRelics": ["relic_1"],
  "currentChapter": 2
}
```

#### `wax_autologin`
Managed by waxjs - stores auto-login session.

### Storage API

#### Save Progress
```typescript
localStorage.setItem('futuresrelic_progress', JSON.stringify(progress));
```

#### Load Progress
```typescript
const saved = localStorage.getItem('futuresrelic_progress');
const progress = saved ? JSON.parse(saved) : defaultProgress;
```

#### Clear Progress
```typescript
localStorage.removeItem('futuresrelic_progress');
```

---

## Advanced Integration

### Adding Firebase

1. Install:
```bash
npm install firebase
```

2. Initialize:
```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ...
});

export const db = getFirestore(app);
```

3. Save Progress:
```typescript
import { doc, setDoc } from 'firebase/firestore';

await setDoc(doc(db, 'progress', accountName), {
  unlockedScenes: progress.unlockedScenes,
  completedBlends: progress.completedBlends,
  updatedAt: new Date(),
});
```

4. Load Progress:
```typescript
import { doc, getDoc } from 'firebase/firestore';

const docSnap = await getDoc(doc(db, 'progress', accountName));
if (docSnap.exists()) {
  const progress = docSnap.data();
}
```

### Adding Supabase

1. Install:
```bash
npm install @supabase/supabase-js
```

2. Initialize:
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

3. Create Table:
```sql
CREATE TABLE progress (
  account_name TEXT PRIMARY KEY,
  unlocked_scenes TEXT[],
  completed_blends TEXT[],
  discovered_relics TEXT[],
  current_chapter INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

4. Save/Load:
```typescript
// Save
await supabase.from('progress').upsert({
  account_name: accountName,
  unlocked_scenes: progress.unlockedScenes,
  completed_blends: progress.completedBlends,
});

// Load
const { data } = await supabase
  .from('progress')
  .select('*')
  .eq('account_name', accountName)
  .single();
```

---

## Security Considerations

1. **Never Store Private Keys**: Only use WAX Cloud Wallet
2. **Validate Template IDs**: Check they exist before processing
3. **Rate Limit Protection**: Cache API responses
4. **Admin Password**: Use environment variable, not hardcoded
5. **HTTPS Only**: Required for wallet connection
6. **Input Sanitization**: Validate all user inputs
7. **CORS**: Configure properly for API requests

---

## Testing

### Unit Test Example
```typescript
import { waxService } from '@/services/waxService';

describe('WaxService', () => {
  it('should format IPFS URL correctly', () => {
    const url = waxService.getIpfsUrl('QmXxxx');
    expect(url).toBe('https://ipfs.io/ipfs/QmXxxx');
  });
});
```

### Integration Test Example
```typescript
it('should unlock scene when NFTs are owned', async () => {
  const mockNFTs = [{ template_id: '123456' }];
  const scene = { requiredNFTs: ['123456'] };
  
  // Test scene unlock logic
});
```

---

## Performance Tips

1. **Memoize Expensive Computations**
```typescript
const ownedTemplates = useMemo(
  () => wallet.nfts.map(nft => nft.template_id),
  [wallet.nfts]
);
```

2. **Lazy Load Components**
```typescript
const AdminPanel = dynamic(() => import('./AdminPanel'), { ssr: false });
```

3. **Cache NFT Data**
```typescript
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
// Implement caching logic
```

4. **Optimize Images**
```typescript
<Image src={url} alt={name} width={300} height={300} quality={85} />
```

---

For questions or contributions, see CONTRIBUTING.md
