'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { OldPaperCard } from './VintageOverlay';
import type { StoryScene } from '@/types';

const ADMIN_PASSWORD = 'futuresrelic2025'; // Change this!

export const AdminPanel: React.FC = () => {
  const { storyScenes, addStoryScene, updateStoryScene } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'scenes' | 'blends'>('scenes');

  // New scene form
  const [newScene, setNewScene] = useState<Partial<StoryScene>>({
    title: '',
    description: '',
    content: '',
    requiredNFTs: [],
    unlocked: false,
    order: storyScenes.length + 1,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleAddScene = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newScene.title || !newScene.description || !newScene.content) {
      alert('Please fill in all required fields');
      return;
    }

    const scene: StoryScene = {
      id: `scene_${Date.now()}`,
      title: newScene.title,
      description: newScene.description,
      content: newScene.content,
      requiredNFTs: newScene.requiredNFTs || [],
      unlocked: false,
      order: newScene.order || storyScenes.length + 1,
      imageUrl: newScene.imageUrl,
    };

    addStoryScene(scene);
    
    // Reset form
    setNewScene({
      title: '',
      description: '',
      content: '',
      requiredNFTs: [],
      unlocked: false,
      order: storyScenes.length + 2,
    });

    alert('Scene added successfully!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <OldPaperCard className="p-8 max-w-md w-full">
          <h2 className="text-3xl font-vintage font-bold mb-6 text-center">
            Admin Access
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-vintage-sepia bg-white"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="
                w-full py-3 bg-vintage-sepia text-vintage-cream
                font-vintage font-bold border-2 border-vintage-darkBrown
                hover:bg-opacity-80 transition-all
              "
            >
              Login
            </button>
          </form>
        </OldPaperCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-vintage font-bold text-vintage-cream">
          Admin Panel
        </h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-4 py-2 bg-vintage-rust text-vintage-cream font-vintage"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-vintage-sepia">
        <button
          onClick={() => setActiveTab('scenes')}
          className={`
            px-6 py-3 font-vintage font-bold
            ${activeTab === 'scenes' 
              ? 'bg-vintage-gold text-vintage-darkBrown' 
              : 'bg-vintage-cream text-vintage-sepia'}
          `}
        >
          Story Scenes
        </button>
        <button
          onClick={() => setActiveTab('blends')}
          className={`
            px-6 py-3 font-vintage font-bold
            ${activeTab === 'blends' 
              ? 'bg-vintage-gold text-vintage-darkBrown' 
              : 'bg-vintage-cream text-vintage-sepia'}
          `}
        >
          Blend Management
        </button>
      </div>

      {activeTab === 'scenes' && (
        <div className="space-y-6">
          {/* Add New Scene */}
          <OldPaperCard className="p-6">
            <h3 className="text-2xl font-vintage font-bold mb-4">Add New Scene</h3>
            <form onSubmit={handleAddScene} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Title *</label>
                <input
                  type="text"
                  value={newScene.title || ''}
                  onChange={(e) => setNewScene({ ...newScene, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-sepia"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Description *</label>
                <input
                  type="text"
                  value={newScene.description || ''}
                  onChange={(e) => setNewScene({ ...newScene, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-sepia"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Content *</label>
                <textarea
                  value={newScene.content || ''}
                  onChange={(e) => setNewScene({ ...newScene, content: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-sepia h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Required NFT Template IDs (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="607289, 607290"
                  onChange={(e) => {
                    const ids = e.target.value
                      .split(',')
                      .map((id) => id.trim())
                      .filter(Boolean);
                    setNewScene({ ...newScene, requiredNFTs: ids });
                  }}
                  className="w-full px-4 py-2 border-2 border-vintage-sepia"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Order</label>
                <input
                  type="number"
                  value={newScene.order || storyScenes.length + 1}
                  onChange={(e) => setNewScene({ ...newScene, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-vintage-sepia"
                />
              </div>

              <button
                type="submit"
                className="
                  w-full py-3 bg-green-700 text-white
                  font-vintage font-bold border-2 border-green-800
                  hover:bg-green-600 transition-all
                "
              >
                Add Scene
              </button>
            </form>
          </OldPaperCard>

          {/* Existing Scenes */}
          <OldPaperCard className="p-6">
            <h3 className="text-2xl font-vintage font-bold mb-4">
              Existing Scenes ({storyScenes.length})
            </h3>
            <div className="space-y-4">
              {storyScenes.map((scene) => (
                <div key={scene.id} className="border-2 border-vintage-sepia p-4">
                  <h4 className="font-bold text-lg">{scene.title}</h4>
                  <p className="text-sm opacity-70 mb-2">{scene.description}</p>
                  <div className="text-xs">
                    <strong>Required NFTs:</strong> {scene.requiredNFTs.join(', ') || 'None'}
                  </div>
                  <div className="text-xs">
                    <strong>Order:</strong> {scene.order}
                  </div>
                </div>
              ))}
            </div>
          </OldPaperCard>
        </div>
      )}

      {activeTab === 'blends' && (
        <OldPaperCard className="p-6">
          <h3 className="text-2xl font-vintage font-bold mb-4">Blend Management</h3>
          <p className="text-lg opacity-70">
            Blend data is automatically fetched from the blockchain via NeftyBlocks.
            Custom blend recipes and storyline connections can be added here.
          </p>
          <div className="mt-6 p-4 bg-yellow-100 border-2 border-yellow-600">
            <strong>Note:</strong> This feature allows you to add custom metadata and
            storyline connections to existing blockchain blends. Coming soon!
          </div>
        </OldPaperCard>
      )}
    </div>
  );
};
