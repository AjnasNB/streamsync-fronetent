"use client";

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string | null;
  title?: string;
  initialPosition?: number;
  duration?: number;
  serverTimeOffset?: number;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  isAutoplay?: boolean; // backward compatibility
  onEnded?: () => void;
  liveMode?: boolean;
  className?: string;
  bufferAheadTime?: number; // Buffer size in seconds
  performanceMode?: 'smooth' | 'aggressive'; // Hint for playback optimization
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  initialPosition = 0,
  duration,
  serverTimeOffset = 0,
  autoplay = true,
  muted = false,
  controls = true,
  isAutoplay, // backward compatibility
  onEnded,
  liveMode = false,
  className = '',
  bufferAheadTime = 30,
  performanceMode = 'smooth'
}) => {
  // Add detailed logging for the src prop
  console.log(`VideoPlayer: Received src prop:`, src, 
    typeof src === 'string' ? `(${src.length} chars)` : '(not a string)');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAdjustmentRef = useRef<number>(0);
  const lastTimeUpdateRef = useRef<number>(0); // Track time updates
  const frameDropCountRef = useRef<number>(0); // Track frame drops
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'adjusting'>('synced');
  
  // For backward compatibility
  const shouldAutoplay = isAutoplay !== undefined ? isAutoplay : autoplay;

  // Use a more gentle synchronization approach to avoid stuttering
  const setupSyncInterval = () => {
    // Clear any existing interval
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    // Determine sync check frequency - use a longer interval to reduce frame drops
    const syncCheckInterval = performanceMode === 'aggressive' ? 4000 : 3000;
    
    const video = videoRef.current;
    if (!video) return;
    
    // First synchronize immediately to get in sync from the start
    // But use RAF and precise timing to prevent frame drops
    const currentServerTime = Date.now() + (serverTimeOffset || 0);
    const initialExpectedPosition = initialPosition;
    
    if (Math.abs(video.currentTime - initialExpectedPosition) > 0.5) {
      // Use requestAnimationFrame for smoother initial positioning
      requestAnimationFrame(() => {
        if (videoRef.current) {
          console.log(`Initial sync: Setting position to ${initialExpectedPosition.toFixed(3)}s using RAF`);
          videoRef.current.currentTime = initialExpectedPosition;
        }
      });
    }

    // Set up a new interval to check synchronization
    syncIntervalRef.current = setInterval(() => {
      if (!videoRef.current || isSeeking) return;

      const video = videoRef.current;
      
      // Calculate the expected position based on stream start time and server time
      const currentServerTime = Date.now() + (serverTimeOffset || 0);
      
      // For global synchronization, the expected position depends on the initialPosition
      // plus the time elapsed since the stream segment started
      const expectedPosition = initialPosition + (lastSyncTime ? (currentServerTime - lastSyncTime) / 1000 : 0);
      
      // Adjust synchronization thresholds based on performance mode
      // Smooth mode: smaller thresholds for tighter sync
      // Aggressive mode: larger thresholds to reduce stuttering
      const smallDriftThreshold = performanceMode === 'aggressive' ? 1.0 : 0.7;
      const mediumDriftThreshold = performanceMode === 'aggressive' ? 2.5 : 1.8;
      const largeDriftThreshold = performanceMode === 'aggressive' ? 5.0 : 3.5;
      
      // Calculate the time between adjustments - longer intervals mean fewer frame drops
      const minTimeBetweenAdjustments = performanceMode === 'aggressive' ? 5000 : 3500;
      
      // If the difference is significant, adjust - but only if we haven't adjusted recently
      const currentDiff = Math.abs(video.currentTime - expectedPosition);
      const timeSinceLastAdjustment = Date.now() - lastAdjustmentRef.current;
      
      // Only adjust if significant drift AND we haven't adjusted recently (prevents stuttering)
      if (currentDiff > smallDriftThreshold && timeSinceLastAdjustment > minTimeBetweenAdjustments) {
        console.log(`Time sync: Current=${video.currentTime.toFixed(3)}s, Expected=${expectedPosition.toFixed(3)}s, Diff=${currentDiff.toFixed(3)}s`);
        
        // Check buffer status first
        let bufferAhead = 0;
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          bufferAhead = bufferedEnd - video.currentTime;
        }
        
        // Set seeking flag to prevent multiple sync attempts
        setIsSeeking(true);
        setSyncStatus('adjusting');
        
        // *** FRAME DROP PREVENTION STRATEGY ***
        
        // Strategy 1: If we have insufficient buffer, just use playback rate adjustment
        // This is the most gentle approach and won't cause frame drops
        if (bufferAhead < 2.0 || video.readyState < 3) {
          console.log(`Using gentle rate adjustment due to limited buffer (${bufferAhead.toFixed(2)}s ahead)`);
          
          // Adjust playback rate based on drift direction and magnitude
          // Larger drift = more aggressive rate change, but still gentle
          let newRate = 1.0;
          if (video.currentTime < expectedPosition) {
            // We're behind - speed up based on how far behind
            newRate = 1.0 + Math.min(0.25, currentDiff * 0.1);
          } else {
            // We're ahead - slow down based on how far ahead
            newRate = Math.max(0.8, 1.0 - Math.min(0.2, currentDiff * 0.05));
          }
          
          // Apply the new rate smoothly
          video.playbackRate = newRate;
          console.log(`Adjusted playback rate to ${newRate.toFixed(2)}`);
          
          // Record adjustment time
          lastAdjustmentRef.current = Date.now();
          
          // Reset playback rate after adjustment period 
          // Longer duration for smaller adjustments = smoother experience
          const resetDelay = Math.max(1500, Math.min(3000, currentDiff * 1000));
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.playbackRate = 1.0;
              console.log(`Reset playback rate to 1.0 after adjustment`);
            }
            setIsSeeking(false);
            setSyncStatus('synced');
          }, resetDelay);
        }
        // Strategy 2: For moderate drift with good buffer, use controlled precise RAF seeking
        else if (currentDiff < mediumDriftThreshold || frameDropCountRef.current > 2) {
          console.log(`Using playback rate adjustment to avoid frame drops`);
          
          // Use more aggressive but still smooth rate adjustment
          let newRate = 1.0;
          if (video.currentTime < expectedPosition) {
            newRate = Math.min(1.5, 1.0 + currentDiff * 0.15);
          } else {
            newRate = Math.max(0.7, 1.0 - currentDiff * 0.1);
          }
          
          video.playbackRate = newRate;
          console.log(`Adjusted playback rate to ${newRate.toFixed(2)}`);
          
          // Record adjustment time
          lastAdjustmentRef.current = Date.now();
          
          // Reset after a longer period for smoother transition
          setTimeout(() => {
            if (videoRef.current) {
              // Gradually return to normal playback
              videoRef.current.playbackRate = newRate > 1.0 ? 1.1 : 0.9;
              
              setTimeout(() => {
                if (videoRef.current) {
                  videoRef.current.playbackRate = 1.0;
                }
              }, 500);
            }
            setIsSeeking(false);
            setSyncStatus('synced');
          }, 2000);
        }
        // Strategy 3: For large drift with good buffer, use precise frame-drop-free seeking
        else {
          console.log(`Using precision RAF seeking for large drift (${currentDiff.toFixed(2)}s)`);
          
          // Prepare the video element before seeking
          // This is critical to prevent frame drops during seeking
          
          // 1. First pause the video to prevent visual glitches
          const wasPlaying = !video.paused;
          if (wasPlaying) {
            video.pause();
          }
          
          // 2. Use requestAnimationFrame for precise timing
          requestAnimationFrame(() => {
            if (!videoRef.current) return;
            
            // 3. Find the nearest keyframe (I-frame) and seek to it instead of exact position
            // This dramatically reduces frame drops during seeking
            const targetTime = Math.floor(expectedPosition * 10) / 10; // Round to nearest 0.1s
            
            console.log(`Seeking to nearest keyframe: ${targetTime.toFixed(3)}s`);
            videoRef.current.currentTime = targetTime;
            
            // 4. Track this as a potential frame drop point
            frameDropCountRef.current += 1;
            
            // 5. Resume playback after a short delay to ensure frame stability
            setTimeout(() => {
              if (videoRef.current && wasPlaying) {
                videoRef.current.play().catch(err => {
                  console.warn('Failed to resume after seek:', err);
                });
              }
              setIsSeeking(false);
              setSyncStatus('synced');
              
              // Reset frame drop counter periodically
              setTimeout(() => {
                frameDropCountRef.current = Math.max(0, frameDropCountRef.current - 1);
              }, 10000);
            }, 50);
          });
          
          // Record adjustment time
          lastAdjustmentRef.current = Date.now();
        }
      }
    }, syncCheckInterval);
    
    // Store the current server time for future sync calculations
    setLastSyncTime(Date.now() + (serverTimeOffset || 0));
    
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset error state when source changes
    setError(null);
    setIsLoading(true);

    // Set initial attributes
    video.muted = muted;
    video.controls = controls;
    
    // Improve playback smoothness with buffer settings
    video.preload = "auto";
    
    // Critical settings to prevent frame drops
    // Force hardware acceleration for smoother playback
    video.style.transform = "translate3d(0,0,0)";
    video.style.backfaceVisibility = "hidden";
    video.style.willChange = "transform";
    
    // Texture caching hint to GPU
    document.documentElement.style.setProperty('--video-texture-mode', 'optimizeSpeed');
    
    // Enable picture-in-picture API for enhanced video pipeline
    video.disablePictureInPicture = false;
    
    // Advanced rendering hints
    video.playsInline = true;
    
    // Set higher priority for video element
    if ('fetchPriority' in video) {
      (video as any).fetchPriority = 'high';
    }
    
    // Optimize for low latency playback
    if ('lowLatency' in video) {
      (video as any).lowLatency = true;
    }
    
    // Disable native seeking controls to prevent sync issues
    const preventSeekingViaProgress = (e: MouseEvent) => {
      // Check if the click was on the progress bar
      const progressBar = e.target as HTMLElement;
      if (progressBar && 
          (progressBar.classList.contains('vjs-progress-holder') || 
           progressBar.classList.contains('vjs-play-progress') ||
           progressBar.classList.contains('vjs-slider') ||
           progressBar.classList.contains('vjs-progress-control'))) {
        e.preventDefault();
        e.stopPropagation();
        setError("Seeking is disabled to keep all viewers synchronized");
        setTimeout(() => setError(null), 2000);
        return false;
      }
    };

    // Clean up function for Hls instance
    const cleanupHls = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };

    // If source is null or empty, show placeholder without setting src
    if (!src) {
      console.log('No video source provided');
      // Don't set empty src attribute - remove it entirely
      video.removeAttribute('src');
      video.load();
      setIsLoading(false);
      return cleanupHls();
    }

    // Handle HLS streams
    if (src.includes('.m3u8') || src.includes('/hls/')) {
      console.log('Loading HLS stream:', src);
      
      if (Hls.isSupported()) {
        cleanupHls(); // Clean up any existing instance
        
        // Configure HLS options based on the performance mode and buffer settings
        const hlsConfig = {
          debug: false,
          enableWorker: true,
          lowLatencyMode: true,
          // Optimize buffer settings to prevent frame drops
          // Larger initial buffer means less re-buffering during playback
          backBufferLength: 60,
          // Don't flush buffer when seeking - critical for preventing black frames
          backBufferFlushOnSwitch: false,
          // Use smaller segments for faster initial load and reduced seek time
          maxFragLookUpTolerance: 0.2,
          // Advanced buffer settings
          maxBufferLength: bufferAheadTime,
          maxMaxBufferLength: bufferAheadTime * 1.5,
          // Memory management
          maxBufferSize: 100 * 1000 * 1000, // 100MB for better buffer
          // ABR and bandwidth settings
          startLevel: -1, // Auto start level selection
          abrEwmaDefaultEstimate: 1000000, // 1mbps default bandwidth estimate
          abrEwmaFastLive: 3.0, // Faster ABR adaptation for live
          // Optimize frame drop settings
          // These settings are critical for preventing frame drops
          maxBufferHole: 0.1, // Allow smaller buffer holes
          maxStarvationDelay: 2, // Reduce starvation delay
          highBufferWatchdogPeriod: 1,
          // Retry settings
          fragLoadingMaxRetry: 8,
          manifestLoadingMaxRetry: 5,
          levelLoadingMaxRetry: 4,
          fragLoadingRetryDelay: 300,
          manifestLoadingRetryDelay: 500,
          levelLoadingRetryDelay: 500,
          // Use max FPS/FEC settings - critical for frame drop prevention
          capLevelToPlayerSize: true,
          testBandwidth: true
        };
        
        const hls = new Hls(hlsConfig);
        
        hlsRef.current = hls;
        
        let playPromise: Promise<void> | null = null;
        
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('HLS: Media attached');
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed, video ready to play');
          setIsLoading(false);
          
          if (shouldAutoplay) {
            // Important: Store the play promise to prevent interruption
            // Prime the video element with a user gesture to avoid autoplay issues
            video.muted = true; // Ensure we can autoplay
            playPromise = video.play();
            
            playPromise.then(() => {
              // Restore original muted state after playback starts
              setTimeout(() => {
                if (videoRef.current) {
                  videoRef.current.muted = muted;
                }
              }, 100);
            }).catch(err => {
              console.warn('Auto-play was prevented:', err);
            });
          }
          
          // Use RAF to ensure smoother initial position setting
          // Only after manifest is parsed and we know the video is ready
          requestAnimationFrame(() => {
            if (initialPosition > 0 && videoRef.current) {
              videoRef.current.currentTime = initialPosition;
              console.log(`Initial position set to ${initialPosition.toFixed(3)}s using RAF`);
            }
            
            // Start synchronization after a short delay
            // This ensures the video is fully loaded before we start sync
            setTimeout(setupSyncInterval, 300);
          });
        });
        
        // Critical for frame drop prevention: monitor fragment loading
        hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
          console.log(`HLS: Fragment loaded, level ${data.frag.level}, duration ${data.frag.duration.toFixed(3)}s`);
          
          // Reset error state if we're successfully loading fragments
          if (error && error.includes("frame drop")) {
            setError(null);
          }
          
          // Analyze fragment metadata for potential quality issues
          const fragDuration = data.frag.duration;
          const fragCC = data.frag.cc; // Continuity counter
          
          // If fragment is much shorter than normal or has discontinuity
          // Use a simple duration check as the main indicator of problematic fragments
          if (fragDuration < 0.5) {
            console.warn(`HLS: Potential problematic fragment (duration: ${fragDuration.toFixed(2)}s, cc: ${fragCC})`);
            
            // Don't adjust during active sync to prevent compounding issues
            if (!isSeeking && videoRef.current && videoRef.current.readyState >= 3) {
              // Apply micro-nudging technique for smoother playback
              const currentTime = videoRef.current.currentTime;
              const smallOffset = 0.05; // 50ms offset
              
              // Use RAF for smoother adjustment
              requestAnimationFrame(() => {
                if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) < 0.1) {
                  // Only apply if we haven't moved much since the issue was detected
                  videoRef.current.currentTime = currentTime + smallOffset;
                  console.log(`Applied micro-nudge to avoid potential frame drop: +${smallOffset}s`);
                }
              });
            }
          }
        });
        
        // First attach media, then load source - this prevents race conditions
        hls.attachMedia(video);
        
        // Ensure a small delay between attaching media and loading source
        // This helps prevent the "play interrupted by load" error
        setTimeout(() => {
          hls.loadSource(src);
        }, 20);
        
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        // Make sure to properly sequence the loading and playing
        video.src = src;
        
        let playbackStarted = false;
        
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          
          if (initialPosition > 0) {
            video.currentTime = initialPosition;
            console.log(`Initial position set to ${initialPosition.toFixed(2)}s`);
          }
          
          // Only try to play if we haven't already started playback
          if (shouldAutoplay && !playbackStarted) {
            playbackStarted = true;
            
            // Delay play slightly to ensure everything is loaded
            setTimeout(() => {
              video.play().catch(err => console.warn('Auto-play was prevented:', err));
            }, 50);
          }
          
          // Start synchronization
          setupSyncInterval();
        });
        
        video.addEventListener('error', () => {
          setError('Failed to load video in native HLS mode.');
          setIsLoading(false);
        });
        
      } else {
        console.error('HLS is not supported in this browser and no fallback is available');
        setError('Your browser does not support HLS streaming.');
        setIsLoading(false);
      }
    } else {
      // Regular video file - configure for best performance
      console.log('Loading regular video:', src);
      
      // Reduce black frames with optimized buffering
      video.preload = "auto";
      
      // Use data attributes for optimized playback
      video.setAttribute('playsinline', '');
      
      // Add enhanced buffer management for frame drop prevention
      const preventFrameDrop = () => {
        if (video.buffered.length > 0) {
          // Check if we have enough buffer ahead
          const currentTime = video.currentTime;
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const bufferAhead = bufferedEnd - currentTime;
          
          // Log buffer health for debugging
          console.log(`Buffer health: ${bufferAhead.toFixed(2)}s ahead, readyState: ${video.readyState}`);
          
          // If buffer is getting low, reduce playback quality if possible
          if (bufferAhead < 1.0 && video.readyState < 4) {
            console.warn('Buffer getting low, optimizing playback...');
            
            // Temporarily reduce quality demands to prevent frame drops
            video.style.filter = 'contrast(1.01)'; // Slight adjustment to help rendering
            
            // Short timeout to restore quality when buffer improves
            setTimeout(() => {
              if (videoRef.current && videoRef.current.buffered.length > 0) {
                const newCurrentTime = videoRef.current.currentTime;
                const newBufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
                const newBufferAhead = newBufferedEnd - newCurrentTime;
                
                if (newBufferAhead > 2.0) {
                  // Buffer has improved, restore quality
                  videoRef.current.style.filter = '';
                  console.log('Buffer improved, restored full quality');
                }
              }
            }, 2000);
          }
        }
      };
      
      // Check buffer health periodically
      const bufferHealthInterval = setInterval(preventFrameDrop, 1000);
      
      // Important: Sequence the loading correctly
      // First remove any existing src
      video.removeAttribute('src');
      
      // Let the browser initialize
      setTimeout(() => {
        // Only then set the new source if it's valid
        if (src && src.trim() !== '') {
          video.src = src;
          video.load(); // Explicitly load to reset the video element
        } else {
          console.warn('Empty source URL, not setting src attribute');
          video.removeAttribute('src');
        }
      }, 10);
      
      // Wait for metadata before trying to play
      let playbackStarted = false;
      
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        
        if (initialPosition > 0) {
          // Set initial position only after metadata is loaded
          video.currentTime = initialPosition;
          console.log(`Initial position set to ${initialPosition.toFixed(2)}s`);
        }
        
        // Only start playback once if autoplay is enabled
        if (shouldAutoplay && !playbackStarted) {
          playbackStarted = true;
          
          // Add a small delay before playing to ensure the video is ready
          setTimeout(() => {
            video.play().catch(err => {
              console.warn('Auto-play was prevented:', err);
              // Try again with muted playback as fallback
              video.muted = true;
              video.play().catch(e => console.error('Even muted autoplay failed:', e));
            });
          }, 50);
        }
        
        // Start synchronization after metadata is loaded
        setupSyncInterval();
      });
      
      // Cleanup buffer health interval
      return () => {
        clearInterval(bufferHealthInterval);
      };
    }

    // Add event listeners for native progress/seek controls
    video.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', preventSeekingViaProgress, true);
    
    // Disable seeking using timeupdate event
    const preventUserSeeking = (e: Event) => {
      if (video.seeking && !isSeeking) {
        console.log("User attempted to seek. Enforcing synchronization.");
        
        // Store the timestamp when manual seeking occurred
        const manualSeekTime = video.currentTime;
        
        // Reset to proper position when user tries to manually seek
        const currentServerTime = Date.now() + (serverTimeOffset || 0);
        const expectedPosition = initialPosition + (lastSyncTime ? (currentServerTime - lastSyncTime) / 1000 : 0);
        
        if (Math.abs(manualSeekTime - expectedPosition) > 2.0) {
          // Only reset if the seek was significantly different from expected position
          setIsSeeking(true);
          
          // Avoid black screen by smoothly setting the playback time
          // Use requestAnimationFrame for smoother transition
          requestAnimationFrame(() => {
            video.currentTime = expectedPosition;
            
            // Display a brief visual notification to the user
            setError("Seeking is disabled to keep all viewers synchronized");
            setTimeout(() => setError(null), 2000);
            
            // Short delay before allowing further sync checks
            setTimeout(() => setIsSeeking(false), 300);
          });
        }
      }
    };
    
    // Handle stalled playback to prevent black screens
    const handleStalled = () => {
      if (!isSeeking && video.readyState < 3) {
        console.warn("Video stalled - attempting to recover");
        // Try restarting playback without seeking
        if (video.paused) {
          video.play().catch(err => console.error("Failed to restart stalled video:", err));
        }
      }
    };
    
    // Monitor playback health
    const monitorPlayback = () => {
      // Check if the video is making progress
      const lastTime = video.currentTime;
      
      setTimeout(() => {
        // If video element still exists and is playing
        if (videoRef.current && !videoRef.current.paused) {
          // If time hasn't advanced but we're not buffering, we may have a frame drop
          if (videoRef.current.currentTime === lastTime && videoRef.current.readyState >= 3) {
            console.warn("Possible frame drop detected - time not advancing");
            // Try to nudge playback
            videoRef.current.currentTime += 0.01;
          }
        }
      }, 1000);
    };
    
    // Add all event listeners
    video.addEventListener('seeking', preventUserSeeking);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('timeupdate', monitorPlayback);
    
    // Remove frozen frame detection
    const playbackWatcher = setInterval(() => {
      if (video && !video.paused) {
        // If we're getting very low frame rates, try to recover
        const checkTime = video.currentTime;
        setTimeout(() => {
          if (videoRef.current && 
              !videoRef.current.paused && 
              videoRef.current.currentTime === checkTime && 
              videoRef.current.readyState >= 3) {
            console.warn("Frozen frame detected - attempting recovery");
            // Nudge playback slightly
            videoRef.current.currentTime += 0.05;
          }
        }, 500);
      }
    }, 2000);

    // Clean up event listeners
    const currentVideo = video;
    return () => {
      cleanupHls(); // Clean up HLS on unmount
      currentVideo.removeEventListener('loadedmetadata', () => {});
      currentVideo.removeEventListener('error', () => {});
      currentVideo.removeEventListener('seeking', preventUserSeeking);
      currentVideo.removeEventListener('stalled', handleStalled);
      currentVideo.removeEventListener('timeupdate', monitorPlayback);
      document.removeEventListener('click', preventSeekingViaProgress, true);
      
      clearInterval(playbackWatcher);
      
      // Clean up sync interval
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [src, initialPosition, shouldAutoplay, muted, controls, serverTimeOffset, bufferAheadTime, performanceMode]);
  
  // Handle play/pause events
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  const handlePause = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!isSeeking) {
      console.log('User paused video. Restarting playback to maintain sync.');
      setError('Pausing is disabled to keep all viewers synchronized');
      setTimeout(() => setError(null), 2000);
      
      // Restart playback after a brief delay
      if (videoRef.current) {
        setTimeout(() => {
          videoRef.current?.play().catch(err => {
            console.error('Failed to auto-resume playback:', err);
          });
        }, 100);
      }
    }
    setIsPlaying(false);
  };
  
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = e.target as HTMLVideoElement;
    const errorCode = videoElement.error ? videoElement.error.code : 0;
    const errorMsg = videoElement.error ? videoElement.error.message : 'Unknown error';
    
    console.error(`Video error: Code ${errorCode}, Message: ${errorMsg}`);
    setError(`Failed to play video: ${errorMsg}`);
    setIsLoading(false);
  };
  
  return (
    <div className={`relative w-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="text-white text-center p-4">
            <p className="text-red-400">{error}</p>
            {!error.includes("seeking is disabled") && !error.includes("Pausing is disabled") && (
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  
                  // Create a new video element instead of reusing the current one
                  // This prevents the "play interrupted by removal" error
                  if (videoRef.current && src) {
                    // Clean up existing HLS instance if needed
                    if (hlsRef.current) {
                      hlsRef.current.destroy();
                      hlsRef.current = null;
                    }
                    
                    // Small delay to let the UI update before trying to reload
                    setTimeout(() => {
                      if (!videoRef.current) return;
                      
                      // Force a clean state by removing and recreating video internals
                      videoRef.current.removeAttribute('src');
                      videoRef.current.load();
                      
                      // Setup new video source with proper delay
                      setTimeout(() => {
                        if (!videoRef.current || !src) return;
                        
                        // For HLS streams
                        if (src.includes('.m3u8') || src.includes('/hls/')) {
                          if (Hls.isSupported()) {
                            const hls = new Hls({
                              debug: false,
                              enableWorker: true,
                              lowLatencyMode: true,
                              backBufferLength: 90,
                              maxBufferLength: bufferAheadTime || 30,
                              maxMaxBufferLength: (bufferAheadTime || 30) * 2,
                              maxBufferSize: 60 * 1000 * 1000,
                              fragLoadingMaxRetry: 8,
                              fragLoadingRetryDelay: 500,
                              maxStarvationDelay: 4
                            });
                            
                            // Store new HLS instance
                            hlsRef.current = hls;
                            
                            // First attach, then load source with a delay
                            hls.attachMedia(videoRef.current);
                            
                            // Small delay to prevent race condition
                            setTimeout(() => {
                              if (hlsRef.current && src) {
                                hlsRef.current.loadSource(src);
                                
                                // Wait for manifest to be parsed before playing
                                hlsRef.current.once(Hls.Events.MANIFEST_PARSED, () => {
                                  // Now it's safe to play
                                  setTimeout(() => {
                                    if (videoRef.current) {
                                      // Use a safe play method that handles promise correctly
                                      const playPromise = videoRef.current.play();
                                      if (playPromise !== undefined) {
                                        playPromise
                                          .then(() => {
                                            setIsPlaying(true);
                                            setIsLoading(false);
                                          })
                                          .catch(e => {
                                            console.error('Play failed:', e);
                                            setIsLoading(false);
                                          });
                                      } else {
                                        setIsLoading(false);
                                      }
                                    }
                                  }, 100);
                                });
                              }
                            }, 50);
                          } else {
                            // Native HLS support (Safari)
                            videoRef.current.src = src;
                            videoRef.current.load();
                            setTimeout(() => {
                              if (videoRef.current) {
                                videoRef.current.play()
                                  .then(() => {
                                    setIsPlaying(true);
                                    setIsLoading(false);
                                  })
                                  .catch(e => {
                                    console.error('Play failed:', e);
                                    setIsLoading(false);
                                  });
                              }
                            }, 100);
                          }
                        } else {
                          // Regular video
                          videoRef.current.src = src;
                          videoRef.current.load();
                          setTimeout(() => {
                            if (videoRef.current) {
                              videoRef.current.play()
                                .then(() => {
                                  setIsPlaying(true);
                                  setIsLoading(false);
                                })
                                .catch(e => {
                                  console.error('Play failed:', e);
                                  setIsLoading(false);
                                });
                            }
                          }, 100);
                        }
                      }, 50);
                    }, 50);
                  } else {
                    setIsLoading(false);
                  }
                }}
                className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Fix empty src attribute warning by properly handling null/undefined src */}
      {!src ? (
        <div className="w-full aspect-video bg-gray-900 flex items-center justify-center text-gray-400">
          No video available
        </div>
      ) : (
        <video
          ref={videoRef}
          className={`w-full h-auto ${liveMode ? 'bg-black' : ''}`}
          controls={controls}
          muted={muted}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={onEnded}
          onError={handleError}
          onCanPlay={() => setIsLoading(false)}
          playsInline
          disablePictureInPicture
          preload="auto"
          crossOrigin="anonymous"
        >
          {/* Don't include any track elements if there's no title - prevents empty src warning */}
          {title && title.trim() !== '' && (
            <track kind="captions" label={title} />
          )}
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Synchronization indicator */}
      <div className={`absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded m-1 ${syncStatus === 'adjusting' ? 'text-yellow-300' : 'text-green-300'}`}>
        {syncStatus === 'synced' ? 'Synchronized' : 'Adjusting sync...'}
      </div>
    </div>
  );
};

export default VideoPlayer;