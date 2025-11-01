# Example Game Configuration

This file shows complete examples of how to configure your Future's Relic game with story scenes and blend recipes.

## Complete Story Example: "The Clockwork Chronicles"

### Scene Configuration

Add these to `context/GameContext.tsx` in the `initialScenes` array:

```typescript
const initialScenes: StoryScene[] = [
  // Chapter 1: The Beginning
  {
    id: 'prologue',
    title: 'Echoes from the Past',
    content: `The letter arrived on a Tuesday, sealed with wax the color of old brass. Your grandfather's elegant script spoke of secrets, of mechanisms hidden in plain sight, of a legacy that transcends the bounds of time itself.

"Meet me at the old workshop," it read. "The gears of destiny are already in motion."

But grandfather had been gone for three years. The workshop, abandoned longer still. Yet here you stand, key in hand, before the rusted iron door that guards mysteries you cannot yet fathom.

The adventure begins now.`,
    requiredNFTs: [], // Unlocked by default - everyone starts here
    unlocked: false,
    cinematicEffect: 'fade',
  },
  
  {
    id: 'chapter1_scene1',
    title: 'The First Mechanism',
    content: `Dust motes dance in shafts of afternoon light as you enter the workshop. Time seems to have stopped here—literally. Every clock on the wall shows 3:47, their hands frozen mid-sweep.

On the workbench, beneath a sheet yellowed with age, you find it: the First Gear. Bronze and intricate, its surface etched with symbols you don't recognize. Yet somehow, inexplicably, you understand their meaning.

"The first key to unlock the impossible," grandfather's voice seems to whisper from memory.

As your fingers close around the gear, the frozen clocks begin to tick again. The mechanism remembers. The workshop awakens.`,
    requiredNFTs: ['123456'], // Requires Bronze Gear NFT
    unlocked: false,
    cinematicEffect: 'flicker',
  },
  
  {
    id: 'chapter1_scene2',
    title: 'The Silver Compass',
    content: `The gear led you here, to a hidden compartment in grandfather's desk. Inside: a compass unlike any you've seen. Its needle doesn't point north—it points to things that don't exist yet. Possibilities. Futures.

"For navigation between what is and what could be," reads the inscription on its case.

You watch, mesmerized, as the needle swings wildly, finally settling on a direction that leads... downward? Beneath the workshop floor, perhaps? The floorboards here seem newer than the rest.

The compass hums with patient energy, waiting for you to follow where it leads.`,
    requiredNFTs: ['123457'], // Requires Silver Compass NFT
    unlocked: false,
    cinematicEffect: 'fade',
  },
  
  {
    id: 'chapter1_scene3',
    title: 'The Obsidian Key',
    content: `Three days of searching the workshop revealed the truth: it's larger on the inside than the outside. Impossible architecture, corridors that loop back on themselves, rooms that exist in quantum superposition.

And in the heart of this labyrinth, you found the final piece: an obsidian key, cold to the touch, inscribed with grandfather's initials and a date—not from the past, but from next Tuesday.

"Time," he once told you, "is not a river. It's an ocean, and we are merely learning to sail."

The key fits a door you're certain wasn't there yesterday. Behind it, stairs descend into impossible darkness. The adventure deepens.`,
    requiredNFTs: ['123458'], // Requires Obsidian Key NFT
    unlocked: false,
    cinematicEffect: 'slide',
  },
  
  // Chapter 2: The Convergence
  {
    id: 'chapter2_scene1',
    title: 'The Convergence Chamber',
    content: `The three artifacts resonate with each other, their combined hum filling the chamber with harmonics that shouldn't be possible. The Bronze Gear spins in your left hand. The Silver Compass needle whirls in your right. The Obsidian Key glows with inner fire from your pocket.

As you descend the impossible stairs, they arrange themselves into a pattern—a configuration. The workshop above thrums with power, every mechanism synchronizing, every gear finding its mate.

This is what grandfather meant. This is the Convergence.

At the bottom of the stairs waits a device: three empty slots arranged in a triangle, each perfectly sized for the artifacts you carry. Ancient symbols glow around each slot, pulsing with anticipation.

The artifacts want to be whole. The mechanism wants to be complete. But once assembled, there is no going back. The timeline will shift. Reality will remember a different past.

Do you dare forge the Chronometer?`,
    requiredNFTs: ['123456', '123457', '123458'], // Requires all three artifacts
    unlocked: false,
    cinematicEffect: 'flicker',
  },
  
  {
    id: 'chapter2_scene2',
    title: 'The Eternal Chronometer',
    content: `The moment the three artifacts lock into place, time fractures.

You see: grandfather as a young man, standing in this very chamber, making the same choice. The workshop being built by hands that shimmer between existence and memory. Yourself, older, placing the letter that started this all.

The Chronometer rises from the device—no longer three separate pieces but a single, perfect mechanism. It ticks with the heartbeat of the universe itself. Past, present, and future swirl within its crystal face, all visible, all accessible, all real.

"Well done," says grandfather, standing beside you, though you know he isn't here. Not yet. Not anymore. Always.

"Now," he smiles, "the real work begins."

The Chronometer opens doors across time. Your journey is only beginning.`,
    requiredNFTs: ['999999'], // Requires Eternal Chronometer (obtained via blend)
    unlocked: false,
    cinematicEffect: 'fade',
  },
];
```

### Blend Recipe Configuration

Add these to `context/GameContext.tsx` in the `initialBlendRecipes` array:

```typescript
const initialBlendRecipes: BlendRecipe[] = [
  {
    id: 'chronometer_blend',
    name: 'The Eternal Chronometer',
    requiredTemplates: ['123456', '123457', '123458'], // Bronze Gear, Silver Compass, Obsidian Key
    resultTemplateId: '999999',
    resultName: 'Eternal Chronometer',
    resultImage: '/relics/chronometer.png',
    description: 'Combine the Bronze Gear, Silver Compass, and Obsidian Key to forge a device that transcends time itself. This legendary artifact allows passage between what was, what is, and what could be.',
  },
  
  // Optional: Additional blends for extended storyline
  {
    id: 'paradox_shard_blend',
    name: 'Paradox Shard',
    requiredTemplates: ['999999', '234567', '234568'], // Chronometer + two more rare items
    resultTemplateId: '888888',
    resultName: 'Fragment of Paradox',
    resultImage: '/relics/paradox-shard.png',
    description: 'A dangerous fusion that creates a shard of pure temporal paradox. Handle with extreme caution—or don\'t handle it at all, depending on which timeline you\'re in.',
  },
];
```

## Template ID Mapping

Replace these with your actual AtomicHub template IDs:

```typescript
const TEMPLATE_IDS = {
  // Chapter 1 Artifacts
  BRONZE_GEAR: '123456',      // Replace with your template ID
  SILVER_COMPASS: '123457',    // Replace with your template ID
  OBSIDIAN_KEY: '123458',      // Replace with your template ID
  
  // Blend Results
  ETERNAL_CHRONOMETER: '999999', // Result of main blend
  PARADOX_SHARD: '888888',      // Result of advanced blend
  
  // Optional: Additional story items
  TEMPORAL_MAP: '234567',
  QUANTUM_LENS: '234568',
};
```

## Finding Your Template IDs

### Method 1: AtomicHub Explorer
1. Go to: https://wax.atomichub.io/explorer/collection/YOUR_COLLECTION
2. Click on any NFT in your collection
3. The URL will show: `/asset/YOUR_COLLECTION/ASSET_ID/TEMPLATE_ID`
4. Or look for "Template ID" in the asset details

### Method 2: Via API
```bash
curl "https://wax.api.atomicassets.io/atomicassets/v1/templates/YOUR_COLLECTION" | jq
```

### Method 3: In App Console
1. Connect wallet with NFTs
2. Open browser console (F12)
3. Type: `localStorage.getItem('futuresrelic_progress')`
4. Check the wallet state in React DevTools

## Customization Ideas

### Different Narrative Styles

**Mystery Thriller:**
```typescript
{
  id: 'mystery_intro',
  title: 'The Disappearance',
  content: 'Detective Morgan hasn\'t been seen in three days. The last transmission from her badge tracker placed her here, in this abandoned warehouse. But there\'s something wrong about this place—something that doesn\'t add up...',
  requiredNFTs: [],
  cinematicEffect: 'flicker',
}
```

**Sci-Fi Adventure:**
```typescript
{
  id: 'scifi_intro',
  title: 'Signal from the Void',
  content: 'The distress beacon is 300 years old, yet it was sent yesterday. Quantum entanglement? Time dilation? Or something far stranger? Your ship approaches the coordinates, and what you find defies every law of physics you thought you understood...',
  requiredNFTs: [],
  cinematicEffect: 'fade',
}
```

**Fantasy Quest:**
```typescript
{
  id: 'fantasy_intro',
  title: 'The Fractured Prophecy',
  content: 'In the ancient tongue, it is written: "When the three shards of the Sundered Crown reunite, the gates between realms shall open once more." You hold one shard. Somewhere in this vast world, two more wait to be discovered...',
  requiredNFTs: [],
  cinematicEffect: 'slide',
}
```

### Alternative Blend Systems

**Multi-Tier Crafting:**
```typescript
// Tier 1: Basic Components
{
  id: 'basic_alloy',
  requiredTemplates: ['metal_1', 'metal_2', 'metal_3'],
  resultName: 'Reinforced Alloy',
}

// Tier 2: Intermediate
{
  id: 'advanced_component',
  requiredTemplates: ['alloy_result', 'crystal_1', 'essence_1'],
  resultName: 'Power Core',
}

// Tier 3: Legendary
{
  id: 'ultimate_weapon',
  requiredTemplates: ['core_result', 'blueprint', 'catalyst'],
  resultName: 'Weapon of Legend',
}
```

**Rarity-Based Requirements:**
```typescript
{
  id: 'legendary_fusion',
  requiredTemplates: ['legendary_1', 'legendary_2', 'legendary_3'],
  resultName: 'Mythic Artifact',
  description: 'Only the rarest artifacts can combine to create something truly transcendent.',
}
```

## Advanced Scene Features

### Branching Narratives:
```typescript
{
  id: 'decision_point',
  title: 'The Choice',
  content: `Two doors stand before you. Through the left door, you hear whispers of the past. Through the right, echoes of futures yet unwritten. 

Your choice here will determine which path the story takes...`,
  requiredNFTs: ['key_item'],
  // In production, you'd track the player's choice and load different scenes
}
```

### Timed Releases:
```typescript
{
  id: 'timed_event',
  title: 'The Convergence Event',
  content: 'Special event content available only during specific dates...',
  requiredNFTs: ['event_pass'],
  // Add date checking in component:
  // unlocked: hasNFT && new Date() >= eventStartDate && new Date() <= eventEndDate
}
```

### Collaborative Unlocks:
```typescript
{
  id: 'community_scene',
  title: 'The Collective Discovery',
  content: 'This scene unlocks when the community collectively holds all pieces...',
  requiredNFTs: ['piece_1', 'piece_2', 'piece_3', 'piece_4', 'piece_5'],
  // Check if ANY wallet in community has all pieces
}
```

## Testing Your Configuration

1. **Start Simple**: Begin with one scene that requires no NFTs
2. **Test Incrementally**: Add one scene at a time
3. **Verify Template IDs**: Double-check they match your collection
4. **Test Blends**: Ensure template ID combinations are correct
5. **Proofread Content**: Check narrative for typos and flow

## Content Writing Tips

1. **Start Strong**: Hook readers immediately
2. **Use Sensory Details**: Engage multiple senses
3. **Build Mystery**: Leave questions unanswered
4. **Character Voice**: Maintain consistent tone
5. **Pacing**: Vary sentence length for rhythm
6. **Foreshadowing**: Plant seeds for future reveals
7. **Emotional Stakes**: Make players care
8. **Cliffhangers**: End scenes with hooks

## Go Live Checklist

- [ ] All template IDs verified and correct
- [ ] Narrative proofread for typos
- [ ] Scene progression tested
- [ ] Blend recipes tested
- [ ] Images uploaded and paths correct
- [ ] Admin password changed
- [ ] Collection name updated
- [ ] Wallet connection tested
- [ ] NFT fetching tested
- [ ] Progress saving tested

---

Now you're ready to build your own blockchain storytelling experience! 🎭
