"use client";

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-red-500">
            About StreamSync
          </h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
        
        <div className="space-y-8">
          <section className="bg-gray-800 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">The Challenge of Global Streaming</h2>
            <p className="mb-4">
              In 2023, when Netflix streamed the Paul vs. Tyson boxing match, millions of viewers experienced lag at the crucial knockout moment.
              Even the industry giants face challenges delivering synchronized, lag-free streaming at massive scale.
            </p>
            <p>
              The ICC Men's Cricket World Cup 2023 set a world record with 59 million concurrent viewers. 
              Handling such enormous traffic without performance degradation remains a complex technical challenge.
            </p>
          </section>
          
          <section className="bg-gray-800 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Our Unique Solution</h2>
            <p className="mb-4">
              StreamSync takes a novel approach to this problem. Rather than treating it as a pure bandwidth challenge,
              we leverage predictable user patterns and personalized content sequencing to deliver flawless streaming experiences.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Pre-Calculated Sequences</h3>
                <p>
                  Every user has a personalized content sequence calculated in advance, similar to how Instagram curates your Reels feed.
                </p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Global Synchronization</h3>
                <p>
                  All streams align to a single global timeline, ensuring everyone sees exactly what they're supposed to see at any given moment.
                </p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Join Anytime</h3>
                <p>
                  Whether you log in at the start or hours later, you'll instantly pick up at the exact point in your personalized sequence.
                </p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Optimized Resources</h3>
                <p>
                  By pre-loading and intelligently caching content, we minimize bandwidth usage and server load without compromising quality.
                </p>
              </div>
            </div>
          </section>
          
          <section className="bg-gray-800 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Technical Architecture</h2>
            <p className="mb-4">
              StreamSync is built on a modern, scalable architecture designed to handle millions of concurrent users:
            </p>
            
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Global Timeline Orchestration:</strong> Our core service maintains precise synchronization across all user streams.
              </li>
              <li>
                <strong>Advanced Content Delivery Network:</strong> Strategically placed edge nodes ensure minimal latency for users worldwide.
              </li>
              <li>
                <strong>Adaptive Streaming:</strong> Video quality adjusts automatically based on available bandwidth to prevent buffering.
              </li>
              <li>
                <strong>Intelligent Prefetching:</strong> The system anticipates and pre-loads upcoming content segments before they're needed.
              </li>
              <li>
                <strong>Fault Tolerance:</strong> Multiple redundancy layers ensure uninterrupted streaming even during partial system failures.
              </li>
            </ul>
          </section>
          
          <section className="bg-gray-800 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Real-World Applications</h2>
            <p className="mb-4">
              Beyond entertainment, StreamSync technology can revolutionize:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium mb-2">Live Sports</h3>
                <p className="text-sm">
                  Deliver personalized camera angles and statistics to millions without lag.
                </p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium mb-2">Virtual Events</h3>
                <p className="text-sm">
                  Create synchronized yet personalized experiences for global virtual conferences.
                </p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium mb-2">Education</h3>
                <p className="text-sm">
                  Deliver customized learning content to thousands of students simultaneously.
                </p>
              </div>
            </div>
          </section>
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Experience the Future of Streaming</h2>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-red-600 rounded-lg font-medium hover:from-purple-700 hover:to-red-700 transition-colors"
          >
            Try StreamSync Now
          </Link>
        </div>
      </div>
    </main>
  );
} 