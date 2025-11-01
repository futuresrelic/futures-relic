'use client';

import React from 'react';
import Link from 'next/link';
import { AdminPanel } from '@/components/AdminPanel';
import { FilmFrame } from '@/components/VintageOverlay';

export default function AdminPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <Link href="/" className="inline-block mb-6 text-vintage-cream hover:text-vintage-gold transition-colors">
            ← Back to Main Site
          </Link>
          
          <FilmFrame className="px-12 py-8">
            <h1 className="text-5xl font-vintage font-bold text-vintage-cream mb-2">
              Admin Control Panel
            </h1>
            <p className="text-xl text-vintage-gold italic">
              Manage Story Scenes & Content
            </p>
          </FilmFrame>
        </header>

        {/* Admin Panel */}
        <AdminPanel />
      </div>
    </main>
  );
}
