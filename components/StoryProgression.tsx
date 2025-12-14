'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { OldPaperCard, FilmFrame } from './VintageOverlay';

const DEFAULT_SCENES = [
  {
    id: 'prologue',
    title: 'The Discovery',
    description: 'In the depths of an abandoned archive...',
    content: `The year is 1927. Deep within the forgotten corridors of the Antiquities Archive, 
    a peculiar discovery changes everything.`,
    requiredNFTs: [],
    unlocked: false,
    order: 1,
  },
];

export const StoryProgression: React.FC = () => {
  const { userNFTs, storyScenes, setStoryScenes, userProgress } = useAppStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (storyScenes.length === 0 && !initialized) {
      setStoryScenes(DEFAULT_SCENES);
      setInitialized(true);
    }
  }, [storyScenes.length, initialized, setStoryScenes]);

  const sortedScenes = [...storyScenes].sort((a, b) => (a.order || 0) - (b.order || 0));
  const isUnlocked = (sceneId: string) => userProgress?.unlockedScenes.includes(sceneId) || false;

  return (
    <div>
      <h2 className="text-3xl font-vintage font-bold text-vintage-cream mb-6">
        📖 The Chronicle
      </h2>
      <div className="space-y-6">
        {sortedScenes.map((scene) => {
          const unlocked = isUnlocked(scene.id) || scene.requiredNFTs.length === 0;
          return (
            <OldPaperCard key={scene.id} className="p-6">
              <h3 className="text-2xl font-vintage font-bold mb-2">
                {unlocked ? '📜' : '🔒'} {scene.title}
              </h3>
              <p className="opacity-70 mb-4">{scene.description}</p>
              {unlocked && <p className="text-lg">{scene.content}</p>}
            </OldPaperCard>
          );
        })}
      </div>
    </div>
  );
};
