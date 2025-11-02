'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { fetchBlendRecipes } from '@/lib/api';
import { OldPaperCard } from './VintageOverlay';
import { parseDisplayData } from '@/lib/recommendations';
import type { StoryScene } from '@/types';

const ADMIN_PASSWORD = 'futuresrelic2025'; // Change this!

interface TemplateData {
  template_id: string;
  name: string;
  img: string;
  max_supply: string;
  issued_supply: string;
}

export const AdminPanel: React.FC = () => {
  const { storyScenes, addStoryScene, updateStoryScene, blendRecipes, userNFTs, setBlendRecipes, setIsLoadingBlends } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'scenes' | 'blends'>('scenes');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [allTemplates, setAllTemplates] = useState<TemplateData[]>([]);

  const [selectedBlendId, setSelectedBlendId] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');

  // New scene form
  const [newScene, setNewScene] = useState<Partial<StoryScene>>({
    title: '',
    description: '',
    content: '',
    requiredNFTs: [],
    unlocked: false,
    order: storyScenes.length + 1,
  });

  // Filter templates by search term
  const filteredTemplates = allTemplates.filter(template => 
    template.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
    template.template_id.includes(templateSearchTerm)
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Fetch blends and templates when admin panel loads
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && blendRecipes.length === 0) {
        console.log('[ADMIN] Fetching blends and templates...');
        setIsLoadingData(true);
        setIsLoadingBlends(true);
        
        try {
          // Fetch blends
          const blends = await fetchBlendRecipes();
          setBlendRecipes(blends);
          console.log(`[ADMIN] Loaded ${blends.length} blends`);

          // Fetch all collection templates
          const templatesResponse = await fetch('/api/collection-templates?collection=futuresrelic');
          const templatesData = await templatesResponse.json();
          
          if (templatesData.success) {
            setAllTemplates(templatesData.templates);
            console.log(`[ADMIN] Loaded ${templatesData.templates.length} templates`);
          }
        } catch (error) {
          console.error('[ADMIN] Error loading data:', error);
        } finally {
          setIsLoadingData(false);
          setIsLoadingBlends(false);
        }
      }
    };

    loadData();
  }, [isAuthenticated, blendRecipes.length, setBlendRecipes, setIsLoadingBlends]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleBlendSelect = (blendId: string) => {
    setSelectedBlendId(blendId);
    
    if (blendId) {
      const blend = blendRecipes.find(b => b.blend_id === blendId);
      if (blend) {
        const displayData = parseDisplayData(blend.display_data);
        
        // Auto-fill from blend data
        setNewScene({
          ...newScene,
          title: displayData?.name || `Blend #${blend.blend_id}`,
          description: displayData?.name || `Blend #${blend.blend_id}`,
          content: displayData?.description || 'Complete this blend to unlock the next chapter of the story.',
          requiredNFTs: blend.ingredients
            .filter(ing => ing.template_id)
            .map(ing => ing.template_id!),
          blend_id: blend.blend_id,
        });
      }
    }
  };

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev => {
      if (prev.includes(templateId)) {
        return prev.filter(id => id !== templateId);
      } else {
        return [...prev, templateId];
      }
    });
    
    // Update requiredNFTs
    const updated = selectedTemplates.includes(templateId)
      ? selectedTemplates.filter(id => id !== templateId)
      : [...selectedTemplates, templateId];
    
    setNewScene({ ...newScene, requiredNFTs: updated });
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
      blend_id: newScene.blend_id,
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
    setSelectedBlendId('');
    setSelectedTemplates([]);

    alert('Scene added successfully!');
  };

  const handleClearForm = () => {
    setNewScene({
      title: '',
      description: '',
      content: '',
      requiredNFTs: [],
      unlocked: false,
      order: storyScenes.length + 1,
    });
    setSelectedBlendId('');
    setSelectedTemplates([]);
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
        <div>
          <h1 className="text-4xl font-vintage font-bold text-vintage-cream">
            Admin Panel
          </h1>
          <p className="text-sm opacity-70 mt-1">
            {isLoadingData ? (
              <span className="animate-pulse">Loading blend and template data...</span>
            ) : (
              <span>{blendRecipes.length} blends loaded • {allTemplates.length} templates available</span>
            )}
          </p>
        </div>
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
          View Blends ({blendRecipes.length})
        </button>
      </div>

      {activeTab === 'scenes' && (
        <div className="space-y-6">
          {/* Info Banner */}
          {isLoadingData && (
            <OldPaperCard className="p-4 bg-vintage-gold bg-opacity-20 border-2 border-vintage-gold">
              <p className="text-sm animate-pulse">
                ⏳ Loading all collection templates... This may take a few seconds for 2500+ templates.
              </p>
            </OldPaperCard>
          )}

          {/* Add New Scene */}
          <OldPaperCard className="p-6">
            <h3 className="text-2xl font-vintage font-bold mb-4">Add New Scene</h3>
            <form onSubmit={handleAddScene} className="space-y-4">
              
              {/* Quick Fill from Blend */}
              <div className="bg-vintage-gold bg-opacity-20 p-4 border-2 border-vintage-gold">
                <label className="block text-sm font-bold mb-2">
                  🎯 Quick Fill from Blend (Optional)
                </label>
                {isLoadingData ? (
                  <div className="text-center py-4">
                    <p className="animate-pulse">Loading blends...</p>
                  </div>
                ) : blendRecipes.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm opacity-70">No blends loaded yet. Please wait...</p>
                  </div>
                ) : (
                  <>
                    <select
                      value={selectedBlendId}
                      onChange={(e) => handleBlendSelect(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-vintage-sepia bg-white"
                    >
                      <option value="">-- Select a Blend to Auto-Fill --</option>
                      {blendRecipes.map(blend => {
                        const displayData = parseDisplayData(blend.display_data);
                        return (
                          <option key={blend.blend_id} value={blend.blend_id}>
                            #{blend.blend_id} - {displayData?.name || `Blend ${blend.blend_id}`}
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-xs opacity-70 mt-2">
                      Selecting a blend will auto-fill title, description, and required NFTs
                    </p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Scene Title *</label>
                <input
                  type="text"
                  value={newScene.title || ''}
                  onChange={(e) => setNewScene({ ...newScene, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-sepia"
                  placeholder="The Discovery"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Short Description *</label>
                <input
                  type="text"
                  value={newScene.description || ''}
                  onChange={(e) => setNewScene({ ...newScene, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-sepia"
                  placeholder="A brief tagline for this scene"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Story Content *</label>
                <textarea
                  value={newScene.content || ''}
                  onChange={(e) => setNewScene({ ...newScene, content: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-sepia h-48 font-mono text-sm"
                  placeholder="Write your story content here..."
                  required
                />
                <p className="text-xs opacity-70 mt-1">
                  Tip: Use line breaks for paragraphs
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Required NFT Templates ({selectedTemplates.length} selected)
                </label>
                
                {/* Search Box */}
                {allTemplates.length > 0 && (
                  <input
                    type="text"
                    value={templateSearchTerm}
                    onChange={(e) => setTemplateSearchTerm(e.target.value)}
                    placeholder="Search templates by name or ID..."
                    className="w-full px-4 py-2 border-2 border-vintage-sepia mb-2"
                  />
                )}

                <div className="border-2 border-vintage-sepia bg-white p-4 max-h-60 overflow-y-auto">
                  {isLoadingData ? (
                    <p className="text-sm opacity-70 text-center py-4 animate-pulse">
                      Loading templates...
                    </p>
                  ) : filteredTemplates.length > 0 ? (
                    <>
                      <p className="text-xs opacity-60 mb-2">
                        Showing {filteredTemplates.length} of {allTemplates.length} templates
                      </p>
                      <div className="space-y-2">
                        {filteredTemplates.slice(0, 100).map(template => (
                          <label key={template.template_id} className="flex items-center gap-2 cursor-pointer hover:bg-vintage-gold hover:bg-opacity-20 p-2">
                            <input
                              type="checkbox"
                              checked={selectedTemplates.includes(template.template_id)}
                              onChange={() => handleTemplateToggle(template.template_id)}
                              className="w-4 h-4"
                            />
                            <span className="font-bold">{template.name}</span>
                            <span className="text-xs opacity-60">(#{template.template_id})</span>
                          </label>
                        ))}
                        {filteredTemplates.length > 100 && (
                          <p className="text-xs opacity-70 text-center py-2">
                            Showing first 100 results. Use search to narrow down.
                          </p>
                        )}
                      </div>
                    </>
                  ) : templateSearchTerm ? (
                    <p className="text-sm opacity-70 text-center py-4">
                      No templates found matching "{templateSearchTerm}"
                    </p>
                  ) : (
                    <p className="text-sm opacity-70 text-center py-4">
                      No templates loaded yet. Please wait...
                    </p>
                  )}
                </div>
                <p className="text-xs opacity-70 mt-2">
                  Users must own ALL selected templates to unlock this scene
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Scene Order</label>
                <input
                  type="number"
                  value={newScene.order || storyScenes.length + 1}
                  onChange={(e) => setNewScene({ ...newScene, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-vintage-sepia"
                  min="1"
                />
                <p className="text-xs opacity-70 mt-1">
                  Scenes are displayed in chronological order
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Image URL (Optional)</label>
                <input
                  type="url"
                  value={newScene.imageUrl || ''}
                  onChange={(e) => setNewScene({ ...newScene, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-sepia"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="
                    flex-1 py-3 bg-green-700 text-white
                    font-vintage font-bold border-2 border-green-800
                    hover:bg-green-600 transition-all
                  "
                >
                  Add Scene
                </button>
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="
                    px-6 py-3 bg-vintage-rust text-white
                    font-vintage font-bold border-2 border-vintage-darkBrown
                    hover:bg-opacity-80 transition-all
                  "
                >
                  Clear Form
                </button>
              </div>
            </form>
          </OldPaperCard>

          {/* Existing Scenes */}
          <OldPaperCard className="p-6">
            <h3 className="text-2xl font-vintage font-bold mb-4">
              Existing Scenes ({storyScenes.length})
            </h3>
            {storyScenes.length === 0 ? (
              <p className="text-lg opacity-70 text-center py-8">
                No scenes yet. Create your first scene above!
              </p>
            ) : (
              <div className="space-y-4">
                {storyScenes
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((scene) => (
                    <div key={scene.id} className="border-2 border-vintage-sepia p-4 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs opacity-60 mr-2">Order: {scene.order}</span>
                          <h4 className="font-bold text-lg inline">{scene.title}</h4>
                        </div>
                        {scene.blend_id && (
                          <span className="text-xs bg-vintage-gold bg-opacity-30 px-2 py-1">
                            Blend #{scene.blend_id}
                          </span>
                        )}
                      </div>
                      <p className="text-sm opacity-70 mb-2">{scene.description}</p>
                      <p className="text-xs opacity-60 mb-2 line-clamp-2">{scene.content}</p>
                      <div className="text-xs mt-2">
                        <strong>Required Templates:</strong> {scene.requiredNFTs.length > 0 ? scene.requiredNFTs.join(', ') : 'None'}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </OldPaperCard>
        </div>
      )}

      {activeTab === 'blends' && (
        <OldPaperCard className="p-6">
          <h3 className="text-2xl font-vintage font-bold mb-4">
            Available Blends ({blendRecipes.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {blendRecipes.map(blend => {
              const displayData = parseDisplayData(blend.display_data);
              return (
                <div key={blend.blend_id} className="border-2 border-vintage-sepia p-3 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold">#{blend.blend_id}</span>
                      <span className="ml-2">{displayData?.name || 'Unnamed Blend'}</span>
                    </div>
                    <span className="text-xs opacity-60">{blend.contract}</span>
                  </div>
                  {displayData?.description && (
                    <p className="text-xs opacity-70 mt-1 line-clamp-2">{displayData.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </OldPaperCard>
      )}
    </div>
  );
};