# Future's Relic - Interactive Blockchain Storytelling Experience

A Next.js application that provides a streamlined, narrative-driven interface for the Future's Relic WAX NFT collection. This app integrates with NeftyBlocks to help users navigate complex blend recipes, track story progression, and discover the optimal path through the collection.

## 🎯 Key Features

### Core Functionality
- **WAX Wallet Integration**: Connect using WaxJS to access your NFTs
- **NFT Portfolio Viewer**: View all your Future's Relic NFTs with detailed information
- **Smart Blend Recommendations**: Analyzes your wallet and suggests which blends you can complete
- **Priority System**: Recommends next steps based on completion percentage, time limits, and scarcity
- **Story Progression**: Unlock narrative scenes based on owned NFTs
- **Admin Panel**: Manage story content and requirements

### NeftyBlocks Integration
- Fetches active blend recipes directly from blockchain
- Displays blend requirements and availability
- Checks user's wallet to determine completable blends
- Direct links to NeftyBlocks for blend execution

### Vintage 1920s Aesthetic
- Film grain overlay
- Vignette effects
- Old film borders
- Flicker animations
- Vintage color palette (sepia, cream, gold tones)
- Old paper texture cards

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- WAX wallet (Cloud Wallet or Anchor)
- (Optional) Firebase account for data persistence

### Installation

1. **Clone and install dependencies:**
```bash
cd futures-relic
npm install
```

2. **Configure environment variables:**
Create a `.env.local` file:
```env
# Optional: Firebase configuration for data persistence
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
futures-relic/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with vintage overlay
│   ├── page.tsx             # Main dashboard page
│   ├── admin/               # Admin panel routes
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── WalletConnect.tsx    # WAX wallet integration
│   ├── RelicViewer.tsx      # NFT portfolio display
│   ├── BlendRecommendations.tsx  # Smart blend suggestions
│   ├── StoryProgression.tsx # Narrative content
│   ├── VintageOverlay.tsx   # Aesthetic components
│   └── AdminPanel.tsx       # Content management
├── lib/                     # Utilities and services
│   ├── api.ts              # NeftyBlocks & AtomicAssets API
│   ├── wax.ts              # WAX wallet service
│   ├── store.ts            # Zustand state management
│   ├── recommendations.ts  # Blend recommendation engine
│   └── firebase.ts         # Optional Firebase config
└── types/                   # TypeScript definitions
    └── index.ts
```

## 🔧 Configuration

### Admin Panel
- Default password: `futuresrelic2025` (change in `/components/AdminPanel.tsx`)
- Access at: `/admin`
- Features:
  - Add/edit story scenes
  - Set NFT requirements for unlocking content
  - Manage storyline progression

### Customization

#### Story Scenes
Edit `DEFAULT_SCENES` in `/components/StoryProgression.tsx` or use the admin panel to:
- Add new chapters
- Set NFT requirements (template IDs)
- Define unlock order

#### Blend Recommendations
The recommendation engine (`/lib/recommendations.ts`) prioritizes blends based on:
- Completion percentage (how many ingredients user has)
- Time-sensitive blends (ending soon)
- Limited quantity blends (low supply remaining)
- User's completed blends history

#### Styling
- Colors: Modify `/tailwind.config.ts` vintage color palette
- Animations: Adjust in `/tailwind.config.ts` and `/app/globals.css`
- Layout: Components use TailwindCSS utility classes

## 🔌 API Integration

### AtomicAssets API
Fetches user's NFTs:
```
https://wax.api.atomicassets.io/atomicassets/v1/assets
```

### Blockchain Data
Fetches blend recipes and drops directly from WAX blockchain tables:
- `blenderizerx` contract (NeftyBlocks blends)
- `neftyblocksd` contract (drops)
- `atomicpacksx` contract (packs)

## 📊 How Blend Recommendations Work

1. **Data Collection**: Fetches all active blends for Future's Relic collection
2. **Wallet Analysis**: Compares user's NFTs against blend requirements
3. **Priority Calculation**:
   - 100 points: Can complete immediately
   - 75+ points: Almost complete (>75% ingredients)
   - 50+ points: Halfway there
   - Bonuses for limited/time-sensitive blends
4. **Sorting**: Displays highest priority blends first
5. **Next Action**: Suggests best immediate step

## 🎨 Design Philosophy

The app provides a cleaner, more intuitive alternative to NeftyBlocks' dense interface by:
- **Narrative Focus**: Story-driven progression guides users
- **Smart Filtering**: Only shows relevant/completable blends
- **Visual Hierarchy**: Priority system highlights important actions
- **Atmospheric UX**: 1920s aesthetic creates immersive experience

## 🔐 Security Notes

- All wallet interactions use official WaxJS library
- No private keys are stored
- Blend execution redirects to official NeftyBlocks
- Admin panel uses simple password auth (implement proper auth for production)

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Digital Ocean
- Any Node.js hosting

## 🛠 Development

### Adding New Features

1. **New Story Scene Types**: Extend `StoryScene` type in `/types/index.ts`
2. **Custom Blend Logic**: Modify `/lib/recommendations.ts`
3. **Additional APIs**: Add services to `/lib/api.ts`
4. **UI Components**: Create in `/components` and use vintage styling

### Testing

Test wallet connection with WAX testnet:
- Change RPC endpoint in `/lib/wax.ts`
- Use testnet wallet and test NFTs

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | No | Firebase API key for data persistence |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | No | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | No | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | No | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | No | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | No | Firebase app ID |

Note: Firebase is optional. Without it, user progress is stored in localStorage.

## 🤝 Contributing

Future enhancements:
- [ ] Real-time blend notifications
- [ ] Community leaderboards
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Multi-language support

## 📜 License

MIT License - feel free to use and modify for your collection!

## 🔗 Links

- [NeftyBlocks Collection](https://neftyblocks.com/collection/futuresrelic)
- [NeftyBlocks Blends](https://neftyblocks.com/collection/futuresrelic/blends)
- [AtomicHub](https://wax.atomichub.io/explorer/collection/wax-mainnet/futuresrelic)
- [WAX Blockchain](https://wax.io)

## 💡 Tips

- **Mobile**: App is fully responsive and works on mobile devices
- **Performance**: NFT images lazy-load for optimal speed
- **Updates**: Blend data refreshes on each wallet connection
- **Offline**: Basic functionality works without internet (uses cached data)

---

**Made with ❤️ for the Future's Relic community**
