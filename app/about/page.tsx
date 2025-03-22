"use client";

import React from 'react';
import Link from 'next/link';
import { APP_NAME, APP_VERSION } from '../config';

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
            About {APP_NAME}
          </h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="space-y-8">
          <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">What is StreamSync?</h2>
            <p className="mb-4">
              StreamSync is a modern video streaming platform that synchronizes video playback across all viewers. 
              Unlike traditional video platforms where users can play any video at any time, 
              StreamSync ensures that everyone is watching the same content at the same time, 
              creating a shared viewing experience.
            </p>
            <p>
              Whether you're running a virtual event, an educational broadcast, or just want to 
              create a TV-like experience for your audience, StreamSync makes it easy to deliver 
              synchronized video content to all your viewers.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <ul className="space-y-4">
              <li className="flex">
                <div className="mr-4 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Global Synchronization</h3>
                  <p className="text-gray-300">All viewers see the same video at the same time, regardless of when they join</p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-4 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Easy Video Management</h3>
                  <p className="text-gray-300">Upload and manage your video library through a simple admin interface</p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-4 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Seamless Playback</h3>
                  <p className="text-gray-300">Videos automatically queue and play in sequence with smooth transitions</p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-4 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Responsive Design</h3>
                  <p className="text-gray-300">Works on desktop, tablet, and mobile devices with an optimized viewing experience</p>
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-900 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Upload Videos</h3>
                  <p>Administrators upload videos through the admin interface, building a library of content</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-900 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Start the Stream</h3>
                  <p>When ready, the administrator starts the global stream to begin playback for all viewers</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-900 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Synchronized Viewing</h3>
                  <p>Viewers join and are automatically synchronized to the current point in the stream</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-900 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Continuous Playback</h3>
                  <p>Videos play in sequence automatically, creating a continuous viewing experience</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Virtual Events</h3>
                <p>Create a shared experience for virtual conference attendees with synchronized content delivery</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Educational Broadcasting</h3>
                <p>Deliver lectures and educational content to students with perfect synchronization</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Community Viewing</h3>
                <p>Build community around synchronized viewing events, like virtual movie nights</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Corporate Communications</h3>
                <p>Ensure all employees receive the same announcements and training videos simultaneously</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center text-sm text-gray-400">
          <p>{APP_NAME} v{APP_VERSION}</p>
          <p className="mt-1">© 2024 {APP_NAME}. All rights reserved.</p>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/stream" className="text-blue-400 hover:underline">
            Go to Stream
          </Link>
          <span className="text-gray-600">|</span>
          <Link href="/admin" className="text-blue-400 hover:underline">
            Admin Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
} 