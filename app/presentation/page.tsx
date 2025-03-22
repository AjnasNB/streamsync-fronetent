"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './presentation.css';

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const presentationRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      title: "StreamSync",
      subtitle: "Real-time Synchronized Video Streaming Platform",
      content: (
        <div className="flex flex-col items-center justify-center">
          <div className="hologram w-64 h-64 mb-8">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-400" stroke="currentColor">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
            </svg>
          </div>
          <p className="text-lg md:text-xl max-w-3xl typing-effect">
            Ensuring all viewers watch the exact same content simultaneously, regardless of when they join — with frame-perfect synchronization.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="stat-box bg-opacity-20 bg-blue-900 p-4 rounded-lg">
              <div className="text-4xl font-bold text-blue-400">100%</div>
              <div className="text-sm text-blue-300">Synchronization</div>
            </div>
            <div className="stat-box bg-opacity-20 bg-blue-900 p-4 rounded-lg">
              <div className="text-4xl font-bold text-blue-400">0ms</div>
              <div className="text-sm text-blue-300">Latency Variance</div>
            </div>
            <div className="stat-box bg-opacity-20 bg-blue-900 p-4 rounded-lg">
              <div className="text-4xl font-bold text-blue-400">HLS</div>
              <div className="text-sm text-blue-300">Streaming Format</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Architecture",
      subtitle: "Robust Dual-Component System",
      content: (
        <div>
          <div className="architecture-diagram mb-10 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="backend-module card-3d">
                <h3 className="text-xl font-bold mb-2">Backend (Flask)</h3>
                <ul className="space-y-2">
                  <li>Video processing service with HLS segmentation</li>
                  <li>Global stream management with μs precision timing</li>
                  <li>User identity and stream tracking system</li>
                  <li>CDN-compatible caching with dynamic buffer settings</li>
                  <li>Automatic quality adaptation based on network conditions</li>
                  <li>Multi-stream management with independent synchronization</li>
                </ul>
                
                <div className="tech-stack mt-4">
                  <div className="text-sm text-blue-300 mb-1">Tech Stack:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-opacity-30 bg-blue-800 rounded text-xs">Python</span>
                    <span className="px-2 py-1 bg-opacity-30 bg-blue-800 rounded text-xs">Flask</span>
                    <span className="px-2 py-1 bg-opacity-30 bg-blue-800 rounded text-xs">FFmpeg</span>
                    <span className="px-2 py-1 bg-opacity-30 bg-blue-800 rounded text-xs">HLS</span>
                    <span className="px-2 py-1 bg-opacity-30 bg-blue-800 rounded text-xs">REST API</span>
                  </div>
                </div>
              </div>
              
              <div className="frontend-module card-3d">
                <h3 className="text-xl font-bold mb-2">Frontend (Next.js)</h3>
                <ul className="space-y-2">
                  <li>Responsive web interface with React components</li>
                  <li>Advanced video player with frame-drop prevention</li>
                  <li>Real-time sync with server offset calculation</li>
                  <li>Automatic recovery from network interruptions</li>
                  <li>Hardware-accelerated rendering for smoother playback</li>
                  <li>Visual indicators for synchronization status</li>
                </ul>
                
                <div className="tech-stack mt-4">
                  <div className="text-sm text-blue-300 mb-1">Tech Stack:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-opacity-30 bg-blue-800 rounded text-xs">Next.js</span>
                    <span className="px-2 py-1 bg-opacity-30 bg-blue-800 rounded text-xs">React</span>
                    <span className="px-2 py-1 bg-opacity-30 bg-blue-800 rounded text-xs">TypeScript</span>
                    <span className="px-2 py-1 bg-opacity-30 bg-blue-800 rounded text-xs">HLS.js</span>
                    <span className="px-2 py-1 bg-opacity-30 bg-blue-800 rounded text-xs">TailwindCSS</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 z-10">
              <div className="data-flow-container relative h-0.5 w-full bg-blue-500 bg-opacity-30">
                <div className="data-stream w-5 absolute top-0 left-0"></div>
                <div className="data-stream w-5 absolute top-0 left-0" style={{ animationDelay: '2s' }}></div>
                <div className="data-stream w-5 absolute top-0 left-0" style={{ animationDelay: '4s' }}></div>
              </div>
            </div>
          </div>
          
          <div className="communication-flow">
            <h3 className="text-lg font-bold mb-4 text-center">System Communication</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-opacity-20 bg-blue-900 p-4 rounded-lg">
                <div className="text-sm mb-2">1. Request Current Video</div>
                <div className="flow-arrow">Frontend → Backend</div>
              </div>
              <div className="bg-opacity-20 bg-blue-900 p-4 rounded-lg">
                <div className="text-sm mb-2">2. Process &amp; Synchronize</div>
                <div className="flow-arrow">Backend Processing</div>
              </div>
              <div className="bg-opacity-20 bg-blue-900 p-4 rounded-lg">
                <div className="text-sm mb-2">3. Stream Synchronized Video</div>
                <div className="flow-arrow">Backend → Frontend</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Market Applications",
      subtitle: "Industries That Benefit from StreamSync",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="industry-card bg-opacity-20 bg-blue-900 p-4 rounded-lg card-3d">
            <div className="icon-container mb-3 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Education</h3>
            <ul className="text-sm space-y-1">
              <li>• Synchronized classroom learning</li>
              <li>• Virtual field trips</li>
              <li>• Remote laboratories</li>
              <li>• Global educational events</li>
            </ul>
            <div className="mt-3 text-xs text-blue-300">
              Perfect timing for educational content
            </div>
          </div>
          
          <div className="industry-card bg-opacity-20 bg-blue-900 p-4 rounded-lg card-3d">
            <div className="icon-container mb-3 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Entertainment</h3>
            <ul className="text-sm space-y-1">
              <li>• Virtual watch parties</li>
              <li>• Live event broadcasts</li>
              <li>• Gaming tournaments</li>
              <li>• Fan reaction experiences</li>
            </ul>
            <div className="mt-3 text-xs text-blue-300">
              Shared moments despite physical distance
            </div>
          </div>
          
          <div className="industry-card bg-opacity-20 bg-blue-900 p-4 rounded-lg card-3d">
            <div className="icon-container mb-3 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Business</h3>
            <ul className="text-sm space-y-1">
              <li>• Corporate training</li>
              <li>• Product launches</li>
              <li>• Marketing campaigns</li>
              <li>• Investor presentations</li>
            </ul>
            <div className="mt-3 text-xs text-blue-300">
              Professional-grade synchronization
            </div>
          </div>
          
          <div className="industry-card bg-opacity-20 bg-blue-900 p-4 rounded-lg card-3d">
            <div className="icon-container mb-3 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Science & Research</h3>
            <ul className="text-sm space-y-1">
              <li>• Remote experiment viewing</li>
              <li>• Research presentations</li>
              <li>• Collaborative analysis</li>
              <li>• Synchronized data visualization</li>
            </ul>
            <div className="mt-3 text-xs text-blue-300">
              Frame-accurate scientific observation
            </div>
          </div>
          
          <div className="industry-card bg-opacity-20 bg-blue-900 p-4 rounded-lg card-3d">
            <div className="icon-container mb-3 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Live Events</h3>
            <ul className="text-sm space-y-1">
              <li>• Sports broadcasts</li>
              <li>• Concert streaming</li>
              <li>• Conference sessions</li>
              <li>• Cultural performances</li>
            </ul>
            <div className="mt-3 text-xs text-blue-300">
              Simultaneous experience for all viewers
            </div>
          </div>
          
          <div className="industry-card bg-opacity-20 bg-blue-900 p-4 rounded-lg card-3d">
            <div className="icon-container mb-3 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Social & Community</h3>
            <ul className="text-sm space-y-1">
              <li>• Family video sharing</li>
              <li>• Religious services</li>
              <li>• Group therapy sessions</li>
              <li>• Community broadcasts</li>
            </ul>
            <div className="mt-3 text-xs text-blue-300">
              Building connection through shared viewing
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Key Features",
      subtitle: "What Makes StreamSync Special",
      content: (
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="feature-card glitch">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3>Global Synchronization</h3>
            <p className="mb-3">All viewers see the exact same content at the same time with millisecond precision</p>
            <div className="bg-opacity-20 bg-blue-900 p-2 rounded-lg text-xs">
              <ul className="list-disc pl-4 space-y-1">
                <li>Server-driven timing system</li>
                <li>Client-side offset calculation</li>
                <li>Perfect synchronization regardless of join time</li>
                <li>Visual indicators of sync status</li>
              </ul>
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-green-400">Real-time synchronized</span>
            </div>
          </div>
          
          <div className="feature-card glitch">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3>Robust Playback</h3>
            <p className="mb-3">Advanced recovery mechanisms ensure uninterrupted viewing experience</p>
            <div className="bg-opacity-20 bg-blue-900 p-2 rounded-lg text-xs">
              <ul className="list-disc pl-4 space-y-1">
                <li>Buffer health monitoring</li>
                <li>Automatic recovery from network issues</li>
                <li>Frame drop prevention mechanisms</li>
                <li>Smart quality switching based on conditions</li>
              </ul>
            </div>
            <div className="mt-3">
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 h-full" style={{width: '92%'}}></div>
              </div>
              <div className="text-xs text-right mt-1 text-green-400">Buffer health: Excellent</div>
            </div>
          </div>
          
          <div className="feature-card glitch">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3>Multi-Stream Support</h3>
            <p className="mb-3">Users can choose between different streams, each with independent synchronization</p>
            <div className="bg-opacity-20 bg-blue-900 p-2 rounded-lg text-xs">
              <ul className="list-disc pl-4 space-y-1">
                <li>Independent stream timing</li>
                <li>User-specific stream assignments</li>
                <li>Seamless switching between streams</li>
                <li>Admin controls for stream management</li>
              </ul>
            </div>
            <div className="mt-3 flex space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-8 w-8 rounded bg-blue-900 bg-opacity-40 flex items-center justify-center text-xs">
                  S{i}
                </div>
              ))}
            </div>
          </div>
          
          <div className="feature-card glitch">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>Optimized Delivery</h3>
            <p className="mb-3">HLS format enables adaptive streaming and CDN-compatibility for global scale</p>
            <div className="bg-opacity-20 bg-blue-900 p-2 rounded-lg text-xs">
              <ul className="list-disc pl-4 space-y-1">
                <li>Adaptive bitrate streaming</li>
                <li>Multiple quality levels (240p-1080p)</li>
                <li>Short segments for reduced latency</li>
                <li>CDN-ready with proper cache headers</li>
              </ul>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span>Quality:</span>
              <div className="flex space-x-1">
                {['240p', '360p', '480p', '720p', '1080p'].map((quality, i) => (
                  <span key={i} className={`px-1.5 py-0.5 rounded ${i === 4 ? 'bg-green-700' : 'bg-blue-900 bg-opacity-40'}`}>
                    {quality}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "How It Works",
      subtitle: "Technical Implementation",
      content: (
        <div className="process-flow space-y-6">
          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="text-lg font-bold">Video Processing</h3>
              <p className="mb-3">Videos are segmented into HLS format for adaptive streaming across various network conditions.</p>
              <div className="details bg-opacity-20 bg-blue-900 p-3 rounded-lg text-sm">
                <strong className="block mb-1">Technical Details:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>FFmpeg processing creates multiple quality levels (240p to 1080p)</li>
                  <li>2-second segments for optimal balance of latency and buffering</li>
                  <li>Automatic thumbnail generation using frame extraction</li>
                  <li>Manifest files (.m3u8) with bandwidth information for adaptive streaming</li>
                  <li>H.264 encoding for maximum device compatibility</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="text-lg font-bold">Stream Synchronization</h3>
              <p className="mb-3">Precisely calculated time offsets ensure all viewers see the same content simultaneously.</p>
              <div className="details bg-opacity-20 bg-blue-900 p-3 rounded-lg text-sm">
                <strong className="block mb-1">How Synchronization Works:</strong>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Server tracks global stream start time with microsecond precision</li>
                  <li>Each client calculates time offset between local and server time</li>
                  <li>Video position is computed using: elapsed_time % playlist_duration</li>
                  <li>Regular sync checks adjust playback rate for drift correction</li>
                  <li>Server provides force_sync flag when seeking is required</li>
                </ol>
                <div className="code-block mt-2 p-2 bg-gray-900 rounded font-mono text-xs overflow-x-auto">
                  position = (server_time - stream_start_time) % total_duration
                </div>
              </div>
            </div>
          </div>
          
          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="text-lg font-bold">Playback Control</h3>
              <p className="mb-3">Sophisticated algorithms ensure smooth playback while maintaining synchronization.</p>
              <div className="details bg-opacity-20 bg-blue-900 p-3 rounded-lg text-sm">
                <strong className="block mb-1">Advanced Features:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Seeking is disabled to maintain synchronization across all viewers</li>
                  <li>GPU-accelerated rendering via CSS transforms and hardware compositing</li>
                  <li>Smart buffer management adjusts based on network conditions</li>
                  <li>Automatic recovery from stalled playback with micro-seeking</li>
                  <li>Visual indicators for synchronization status</li>
                </ul>
              </div>
              <div className="algorithm-visualization mt-3 h-6 w-full bg-gray-900 rounded-lg overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 animate-pulse" style={{width: "85%"}}></div>
              </div>
            </div>
          </div>
          
          <div className="process-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3 className="text-lg font-bold">Performance Optimization</h3>
              <p className="mb-3">Multiple strategies work together to ensure smooth playback across diverse devices and networks.</p>
              <div className="details bg-opacity-20 bg-blue-900 p-3 rounded-lg text-sm">
                <strong className="block mb-1">Key Optimizations:</strong>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-bold mb-1">Client-Side</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Dynamic buffer size based on network stability</li>
                      <li>requestAnimationFrame for frame-accurate timing</li>
                      <li>Gentle playback rate adjustments (0.95x - 1.05x)</li>
                      <li>Preloading of upcoming segments</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Server-Side</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>CDN-compatible static file serving</li>
                      <li>Cached segment delivery with appropriate headers</li>
                      <li>Stream health monitoring and diagnostics</li>
                      <li>Optimized segment boundaries at keyframes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Future Scope",
      subtitle: "What's Next for StreamSync",
      content: (
        <div className="future-scope">
          <div className="scope-timeline">
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Enhanced Synchronization</h3>
                <p className="mb-2">Taking synchronization to the next level with cutting-edge technologies</p>
                <div className="bg-opacity-20 bg-blue-900 p-2 rounded-lg text-xs">
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>WebRTC Integration:</strong> Ultra-low latency for real-time interactions</li>
                    <li><strong>P2P Delivery:</strong> Distributed infrastructure reducing server load</li>
                    <li><strong>AI-powered Buffering:</strong> Predictive algorithms based on viewing patterns</li>
                    <li><strong>Network-Aware Timing:</strong> Adjustments based on connection quality</li>
                  </ul>
                </div>
                <div className="mt-2 text-xs flex items-center space-x-2">
                  <span className="text-blue-300">ETA:</span>
                  <span>Q3 2024</span>
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Advanced Content Management</h3>
                <p className="mb-2">Sophisticated tools for content creators and administrators</p>
                <div className="bg-opacity-20 bg-blue-900 p-2 rounded-lg text-xs">
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Scheduled Playlists:</strong> Automatic transitions and programming</li>
                    <li><strong>Dynamic Content:</strong> Personalized streams based on viewer preferences</li>
                    <li><strong>Live Integration:</strong> Seamless mixing of live and pre-recorded content</li>
                    <li><strong>Content Analytics:</strong> Viewer engagement and retention metrics</li>
                  </ul>
                </div>
                <div className="mt-2 text-xs flex items-center space-x-2">
                  <span className="text-blue-300">ETA:</span>
                  <span>Q4 2024</span>
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Interactive Features</h3>
                <p className="mb-2">Transform passive viewing into engaging shared experiences</p>
                <div className="bg-opacity-20 bg-blue-900 p-2 rounded-lg text-xs">
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Synchronized Reactions:</strong> Emoji responses at specific moments</li>
                    <li><strong>Real-time Polls:</strong> Interactive viewer voting tied to content</li>
                    <li><strong>Collaborative Annotations:</strong> Shared drawing and highlighting</li>
                    <li><strong>Timed Comments:</strong> Messages anchored to specific timestamps</li>
                  </ul>
                </div>
                <div className="mt-2 text-xs flex items-center space-x-2">
                  <span className="text-blue-300">ETA:</span>
                  <span>Q1 2025</span>
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Analytics and Monitoring</h3>
                <p className="mb-2">Deep insights into viewing experience and system performance</p>
                <div className="bg-opacity-20 bg-blue-900 p-2 rounded-lg text-xs">
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Performance Dashboards:</strong> Real-time metrics on playback quality</li>
                    <li><strong>Geographical Distribution:</strong> Viewer locations and network conditions</li>
                    <li><strong>QoE Metrics:</strong> Buffer ratio, stall events, and sync accuracy</li>
                    <li><strong>Predictive Maintenance:</strong> Early warning for potential issues</li>
                  </ul>
                </div>
                <div className="mt-2 text-xs flex items-center space-x-2">
                  <span className="text-blue-300">ETA:</span>
                  <span>Q2 2025</span>
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Mobile Applications</h3>
                <p className="mb-2">Extend synchronized viewing to native mobile platforms</p>
                <div className="bg-opacity-20 bg-blue-900 p-2 rounded-lg text-xs">
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Native iOS/Android Apps:</strong> Optimized for mobile playback</li>
                    <li><strong>Push Notifications:</strong> Alerts for stream events and changes</li>
                    <li><strong>Background Audio:</strong> Continue listening while using other apps</li>
                    <li><strong>Offline Sync:</strong> Download content for synchronized offline viewing</li>
                  </ul>
                </div>
                <div className="mt-2 text-xs flex items-center space-x-2">
                  <span className="text-blue-300">ETA:</span>
                  <span>Q3 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Thank You",
      subtitle: "Experience the Future of Synchronized Streaming",
      content: (
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center max-w-2xl">
            <p className="text-lg mb-6">
              StreamSync delivers frame-perfect video synchronization across all devices, 
              creating truly shared viewing experiences regardless of viewer location.
            </p>
            
            <div className="stats flex flex-wrap justify-center gap-6 mb-8">
              <div className="stat p-3 bg-opacity-20 bg-blue-900 rounded-lg">
                <div className="text-3xl font-bold text-blue-400">100%</div>
                <div className="text-sm">Synchronization</div>
              </div>
              <div className="stat p-3 bg-opacity-20 bg-blue-900 rounded-lg">
                <div className="text-3xl font-bold text-blue-400">Multi</div>
                <div className="text-sm">Stream Support</div>
              </div>
              <div className="stat p-3 bg-opacity-20 bg-blue-900 rounded-lg">
                <div className="text-3xl font-bold text-blue-400">Adaptive</div>
                <div className="text-sm">Quality Streaming</div>
              </div>
            </div>
          </div>
          
          <div className="cta-button">
            <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105">
              Explore StreamSync
            </a>
          </div>
          
          <div className="robot-animation">
            <div className="robot-head"></div>
            <div className="robot-body"></div>
            <div className="robot-arm left"></div>
            <div className="robot-arm right"></div>
          </div>
          
          <div className="contact-info text-center text-sm text-blue-300">
            <p>For more information, contact: team@streamsync.io</p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    // Create animated background elements
    if (presentationRef.current) {
      // Add circuit lines
      const circuits = Array.from({ length: 20 }, (_, i) => {
        const circuit = document.createElement('div');
        circuit.className = 'circuit';
        circuit.style.top = `${Math.random() * 100}%`;
        circuit.style.left = `${Math.random() * 100}%`;
        circuit.style.width = `${Math.random() * 150 + 50}px`;
        circuit.style.height = `${Math.random() * 2 + 1}px`;
        circuit.style.animationDelay = `${Math.random() * 5}s`;
        return circuit;
      });
      
      // Add data streams
      const dataStreams = Array.from({ length: 15 }, (_, i) => {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.top = `${Math.random() * 100}%`;
        stream.style.left = `${Math.random() * 100}%`;
        stream.style.width = `${Math.random() * 100 + 50}px`;
        stream.style.animationDelay = `${Math.random() * 8}s`;
        stream.style.transform = `rotate(${Math.random() * 360}deg)`;
        return stream;
      });
      
      // Add radar elements
      const radars = Array.from({ length: 2 }, (_, i) => {
        const radar = document.createElement('div');
        radar.className = 'radar';
        radar.style.top = `${10 + Math.random() * 80}%`;
        radar.style.left = `${10 + Math.random() * 80}%`;
        radar.style.opacity = `${0.3 + Math.random() * 0.3}`;
        return radar;
      });
      
      // Append all elements to the presentation container
      [...circuits, ...dataStreams, ...radars].forEach(element => {
        presentationRef.current?.appendChild(element);
      });
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="presentation-container" ref={presentationRef}>
      <div className="presentation-background">
        <div className="grid-overlay"></div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          className="slide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="slide-content">
            <h1 className="slide-title">{slides[currentSlide].title}</h1>
            <h2 className="slide-subtitle">{slides[currentSlide].subtitle}</h2>
            <div className="slide-body">
              {slides[currentSlide].content}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="navigation-controls">
        <button 
          onClick={prevSlide} 
          disabled={currentSlide === 0 || isAnimating}
          className={`nav-btn prev ${currentSlide === 0 ? 'disabled' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="slide-dots">
          {slides.map((_, index) => (
            <button 
              key={index}
              className={`slide-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentSlide(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }
              }}
            />
          ))}
        </div>
        
        <button 
          onClick={nextSlide} 
          disabled={currentSlide === slides.length - 1 || isAnimating}
          className={`nav-btn next ${currentSlide === slides.length - 1 ? 'disabled' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="presentation-footer">
        <div className="progress-bar">
          <div 
            className="progress-indicator" 
            style={{ width: `${(currentSlide / (slides.length - 1)) * 100}%` }}
          ></div>
        </div>
        <div className="slide-counter">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
}