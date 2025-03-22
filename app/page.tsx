"use client";

import React from 'react';
import Link from 'next/link';
import { APP_NAME } from './config';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-red-500">
          {APP_NAME}
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
          A revolutionary platform for synchronized video streaming
        </p>
        
        <div className="mb-12">
          <Link 
            href="/presentation" 
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-lg transition-transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
          >
            <span className="flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
              View Interactive Presentation
            </span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-16">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg transform transition-transform hover:scale-105">
            <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3">Watch Together</h2>
            <p className="text-gray-400 mb-6">
              Experience synchronized streaming where everyone sees the same content at the same time, creating a truly shared viewing experience.
            </p>
            <Link 
              href="/stream"
              className="inline-block w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              Go to Stream
            </Link>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg transform transition-transform hover:scale-105">
            <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3">Manage Content</h2>
            <p className="text-gray-400 mb-6">
              Upload your videos, control the stream, and customize the viewing experience through our intuitive admin dashboard.
            </p>
            <Link 
              href="/admin"
              className="inline-block w-full px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-colors"
            >
              Admin Dashboard
            </Link>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg transform transition-transform hover:scale-105">
            <div className="h-12 w-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3">Learn More</h2>
            <p className="text-gray-400 mb-6">
              Discover how StreamSync works, explore its features, and learn about the technology behind synchronized streaming.
            </p>
            <Link 
              href="/about"
              className="inline-block w-full px-4 py-2 bg-gradient-to-r from-yellow-600 to-red-600 rounded-lg font-medium hover:from-yellow-700 hover:to-red-700 transition-colors"
            >
              About StreamSync
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">How StreamSync Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="h-10 w-10 bg-purple-900 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold">1</div>
              <p className="text-gray-300">Upload your videos through the admin dashboard</p>
            </div>
            <div>
              <div className="h-10 w-10 bg-purple-900 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold">2</div>
              <p className="text-gray-300">Start the global stream when you&apos;re ready</p>
            </div>
            <div>
              <div className="h-10 w-10 bg-purple-900 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold">3</div>
              <p className="text-gray-300">Share the link with your audience</p>
            </div>
            <div>
              <div className="h-10 w-10 bg-purple-900 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold">4</div>
              <p className="text-gray-300">Everyone watches together in perfect sync</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="w-full max-w-5xl mx-auto mt-16 text-center text-sm text-gray-500">
        <p>© 2024 {APP_NAME}. All rights reserved.</p>
      </footer>
    </main>
  );
}
