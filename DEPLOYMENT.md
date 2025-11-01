# Deployment Guide - Future's Relic

## Pre-Deployment Checklist

- [ ] Test locally with `npm run dev`
- [ ] Update collection name in `services/waxService.ts`
- [ ] Add your story scenes and blend recipes
- [ ] Change admin password in `components/AdminPanel.tsx`
- [ ] Test wallet connection
- [ ] Test NFT fetching
- [ ] Test scene unlocking
- [ ] Test blend functionality
- [ ] Update metadata in `app/layout.tsx`
- [ ] Add your favicon and images
- [ ] Build successfully: `npm run build`

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Built for Next.js
- Free tier available
- Automatic HTTPS
- Global CDN
- Easy custom domains

**Steps:**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production:
```bash
vercel --prod
```

**Environment Variables:**
None required for basic setup. Add if you integrate Firebase/Supabase.

**Custom Domain:**
1. Go to Vercel dashboard
2. Select your project
3. Settings → Domains
4. Add your domain and follow DNS instructions

---

### Option 2: Netlify

**Steps:**

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

**netlify.toml Configuration:**
Create `netlify.toml` in root:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

### Option 3: Railway

**Steps:**

1. Create account at railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Connect your repository
4. Railway auto-detects Next.js
5. Deploy automatically on push

**Custom Start Command:**
```bash
npm run start
```

---

### Option 4: Cloudflare Pages

**Steps:**

1. Go to pages.cloudflare.com
2. Connect GitHub repository
3. Build settings:
   - Build command: `npm run build`
   - Build output: `.next`
   - Framework: Next.js

---

### Option 5: Self-Hosted (VPS/Docker)

**Prerequisites:**
- Ubuntu/Debian server
- Node.js 18+
- PM2 or similar process manager

**Setup:**

1. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Install PM2:
```bash
sudo npm install -g pm2
```

3. Clone and build:
```bash
git clone YOUR_REPO
cd futures-relic
npm install
npm run build
```

4. Start with PM2:
```bash
pm2 start npm --name "futures-relic" -- start
pm2 save
pm2 startup
```

5. Setup Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Docker Setup:**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  futures-relic:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

---

## Post-Deployment

### 1. SSL Certificate
Most platforms provide automatic HTTPS. For self-hosted:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 2. Monitor Performance
- Use Vercel Analytics (built-in)
- Add Google Analytics
- Monitor API calls to AtomicHub

### 3. Database Integration (Optional)

**Firebase:**
```bash
npm install firebase
```

Create `lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

**Supabase:**
```bash
npm install @supabase/supabase-js
```

Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 4. Environment Variables

If using database or analytics, add to `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_id
```

In Vercel/Netlify dashboard, add these under Environment Variables.

---

## Performance Optimization

### 1. Image Optimization
Add images to `public/` folder and use Next.js Image:
```tsx
import Image from 'next/image';
<Image src="/relics/image.png" alt="..." width={300} height={300} />
```

### 2. Caching
NFT data can be cached:
```typescript
// In waxService.ts
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cachedNFTs: { [key: string]: { data: NFTAsset[], timestamp: number } } = {};
```

### 3. Lazy Loading
For heavy components:
```typescript
import dynamic from 'next/dynamic';
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  ssr: false,
});
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### CORS Issues
AtomicHub API should work cross-origin, but if issues arise:
- Use API routes in Next.js as proxy
- Or deploy to subdomain of same domain

### Wallet Connection Issues
- Ensure HTTPS in production (WAX Cloud Wallet requires it)
- Check browser console for errors
- Verify waxjs is loaded correctly

---

## Maintenance

### Updating Dependencies
```bash
npm outdated
npm update
npm run build  # Test build
```

### Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor AtomicHub API status
- Check WAX blockchain status

### Backup
- Use Git for code
- Export game state/scenes from database regularly
- Keep admin access credentials secure

---

## Scaling Considerations

### High Traffic
- Vercel/Netlify handle scaling automatically
- For self-hosted: use load balancer (Nginx/HAProxy)
- Consider Redis for caching NFT data

### Multiple Collections
- Add collection selector in UI
- Update services to handle multiple collections
- Separate scenes/recipes per collection

### Advanced Features
- Add WebSocket for real-time updates
- Integrate push notifications
- Add social features (comments, likes)
- Implement analytics dashboard

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **WAX Developer Portal**: https://developer.wax.io/

---

Good luck with your deployment! 🚀
