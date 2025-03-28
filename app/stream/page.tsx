"use client";

import { useState, useEffect, useRef, ReactNode } from 'react';
import { getCurrentVideo, getServerStatus, registerUser, getVideoStreamUrl } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import { Video } from '../types/video';
import './stream.css';

// Type interface for server status response
interface ServerStatus {
  running: boolean;
  stream_active?: boolean;
  num_videos?: number;
}

// Define type for the API response
interface VideoResponse {
  id: string;
  video_id?: string;  // Backend might return either id or video_id
  title?: string;
  name?: string;
  position: number;
  duration: number;
  next_video?: string;
  time_until_next?: number;
  stream_start_time: number;
  server_time: number;
  sync_interval?: number;
  force_sync?: boolean;
  elapsed_total?: number;
  playlist_duration?: number;
  playlist_position?: number;
  hls_enabled?: boolean;
  hls_url?: string;
  thumbnail_url?: string;
  buffer_ahead_time?: number;
  performance_mode?: 'smooth' | 'aggressive';
}

interface FetchState {
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number | null;
}

// Helper function to format seconds to MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function StreamPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [serverTimeOffset, setServerTimeOffset] = useState<number>(0);
  const [fetchState, setFetchState] = useState<FetchState>({
    isLoading: true,
    error: null,
    lastFetchTime: null
  });
  
  const fetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityRef = useRef({ isTabActive: true });

  // Initialize userId on component mount
  useEffect(() => {
    async function initializeUser() {
      try {
        // Check for userId in localStorage first
        let storedUserId = localStorage.getItem('streamUserId');
        
        if (!storedUserId) {
          // Register a new user
          console.log('Registering new user...');
          const response = await registerUser();
          storedUserId = response.user_id;
          localStorage.setItem('streamUserId', storedUserId);
        }
        
        console.log(`Using user ID: ${storedUserId}`);
        setUserId(storedUserId);
      } catch (error) {
        console.error('Failed to initialize user:', error);
        setFetchState(prevState => ({
          ...prevState,
          isLoading: false,
          error: 'Failed to connect to server. Please refresh the page.'
        }));
      }
    }

    // Set up visibility change listener
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      visibilityRef.current.isTabActive = isVisible;
      
      // If becoming visible again, trigger a fetch
      if (isVisible && userId) {
        fetchCurrentVideo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initialize
    initializeUser();
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
      }
    };
  }, []);

  // Start fetching video when userId is available
  useEffect(() => {
    if (userId) {
      fetchCurrentVideo();
    }
  }, [userId]);

  const fetchCurrentVideo = async () => {
    // Clear any existing fetch timer
    if (fetchTimerRef.current) {
      clearTimeout(fetchTimerRef.current);
      fetchTimerRef.current = null;
    }
    
    // Prevent multiple simultaneous fetches
    if (fetchState.isLoading) {
      console.log("Fetch already in progress, skipping");
      return;
    }

    // Set loading state
    setFetchState(prevState => ({
      ...prevState,
      isLoading: true,
      error: null,
      lastFetchTime: Date.now()
    }));

    try {
      // Check if we have a user ID
      if (!userId) {
        console.warn("Fetch attempted without userId");
        setFetchState(prevState => ({
          ...prevState,
          isLoading: false,
          error: "No user ID available"
        }));
        
        // Try again in 2 seconds
        fetchTimerRef.current = setTimeout(fetchCurrentVideo, 2000);
        return;
      }

      // First check if the server is running
      const serverStatus: ServerStatus = await getServerStatus();
      console.log("Server status check:", serverStatus);

      if (!serverStatus.running) {
        console.warn("Server not running, will retry soon");
        setFetchState(prevState => ({
          ...prevState,
          isLoading: false,
          error: "Waiting for stream..."
        }));
        
        // Try again in 3 seconds
        fetchTimerRef.current = setTimeout(fetchCurrentVideo, 3000);
        return;
      }

      console.log(`Fetching current video for user ${userId}`);
      try {
        const response: VideoResponse = await getCurrentVideo(userId);
        console.log("Video response:", response);

        // Validate video ID before proceeding
        if (!response || !response.id) {
          console.warn("Missing video ID in response:", response);
          setFetchState(prevState => ({
            ...prevState,
            isLoading: false,
            error: "Invalid video data received"
          }));
          fetchTimerRef.current = setTimeout(fetchCurrentVideo, 3000);
          return;
        }

        // Calculate server time offset for synchronization
        const clientTime = Date.now();
        const serverTime = response.server_time;
        const offset = serverTime - clientTime;
        console.log(`Time sync: Client=${clientTime}, Server=${serverTime}, Offset=${offset}ms`);
        
        // Log both position and stream_start_time values
        console.log(`Video position: ${response.position}s, Stream started: ${response.stream_start_time}`);
        
        // Update server time offset for precise synchronization
        setServerTimeOffset(offset);

        // Debug log before updating state
        console.log("Updating currentVideo state with:", {
          id: response.id,
          title: response.title || response.name,
          position: response.position,
          stream_start_time: response.stream_start_time
        });

        // Check if the video ID has changed before updating the player
        // This prevents unnecessary re-renders of the video player
        const videoIdChanged = !currentVideo || currentVideo.id !== (response.video_id || response.id);
        
        // Only set loading state if we're changing videos
        if (videoIdChanged) {
          setFetchState(prevState => ({
            ...prevState,
            isLoading: true,
            error: null
          }));
        }

        // Update with the fetched video - make sure we have a valid ID
        setCurrentVideo(prevVideo => {
          // If it's the same video, just update the position and timing data
          if (prevVideo && prevVideo.id === (response.video_id || response.id)) {
            return {
              ...prevVideo,
              position: response.position,
              duration: response.duration,
              nextVideo: response.next_video,
              timeUntilNext: response.time_until_next,
              streamStartTime: response.stream_start_time
            };
          }
          
          // Otherwise return a completely new video object with required fields
          const newVideo: Video = {
            id: response.video_id || response.id, // Try both possible ID fields
            title: (response.title || response.name || "Untitled Video"), // Ensure title is never undefined
            position: response.position,
            duration: response.duration,
            nextVideo: response.next_video,
            timeUntilNext: response.time_until_next,
            hlsEnabled: response.hls_enabled,
            hlsUrl: response.hls_url,
            thumbnailUrl: response.thumbnail_url,
            streamStartTime: response.stream_start_time,
            bufferAheadTime: response.buffer_ahead_time,
            performanceMode: response.performance_mode as 'smooth' | 'aggressive' | undefined
          };
          return newVideo;
        });

        // Update fetch state after we've processed the response
        setFetchState(prevState => ({
          ...prevState,
          isLoading: false, 
          error: null,
          lastFetchTime: Date.now()
        }));

        // Adjust sync interval based on server suggestion
        // - Use a minimum of 1.5s to avoid excessive API calls
        // - Use a maximum of 5s to ensure we don't lose sync for too long
        const nextFetchTime = Math.min(
          Math.max(response.sync_interval || 2000, 1500),
          5000
        );
        
        fetchTimerRef.current = setTimeout(fetchCurrentVideo, nextFetchTime);
      } catch (apiError) {
        console.error("API error fetching current video:", apiError);
        setFetchState(prevState => ({
          ...prevState,
          isLoading: false,
          error: apiError instanceof Error ? apiError.message : "Failed to fetch video data"
        }));
        
        // Try again in 4 seconds on API error
        fetchTimerRef.current = setTimeout(fetchCurrentVideo, 4000);
      }
      
    } catch (error) {
      console.error("Error in fetch current video:", error);
      setFetchState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch video"
      }));
      
      // Try again in 5 seconds on general error
      fetchTimerRef.current = setTimeout(fetchCurrentVideo, 5000);
    }
  };

  // Main render function
  return (
    <div className="stream-page">
      <div className="header">
        <h1>Live Stream</h1>
        {userId && <p className="user-id">Viewer ID: {userId.substring(0, 8)}</p>}
      </div>

      {/* We always render the video container to prevent layout shifts */}
      <div className="video-container" style={{opacity: currentVideo && !fetchState.error ? 1 : 0}}>
        {currentVideo && !fetchState.error && (
          // Log the rendering outside JSX
          (() => {
            console.log("Rendering VideoPlayer with currentVideo:", currentVideo);
            return (
              <>
                <VideoPlayer
                  key={`player-${currentVideo.id || "no-video"}`}
                  src={
                    currentVideo.id 
                      ? getVideoStreamUrl(currentVideo.id, currentVideo.hlsEnabled, currentVideo.hlsUrl) 
                      : null
                  }
                  title={currentVideo.title || "Untitled Video"}
                  initialPosition={currentVideo.position || 0}
                  duration={currentVideo.duration || 0}
                  serverTimeOffset={serverTimeOffset}
                  autoplay={true}
                  muted={false}
                  controls={true}
                  bufferAheadTime={currentVideo.bufferAheadTime || 30}
                  performanceMode={currentVideo.performanceMode || 'smooth'}
                />
                <div className="video-info">
                  <h2>{currentVideo.title || "Untitled Video"}</h2>
                  <p>Duration: {formatTime(currentVideo.duration || 0)}</p>
                  {currentVideo.nextVideo && (
                    <p>Next video in: {formatTime(currentVideo.timeUntilNext || 0)}</p>
                  )}
                  <p className="text-sm text-gray-400">Synchronized stream - seeking disabled</p>
                </div>
              </>
            );
          })()
        )}
      </div>

      {/* Show loading spinner as an overlay */}
      {(fetchState.isLoading || !currentVideo || fetchState.error) && (
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p className="loading-text">{fetchState.error || "Waiting for stream..."}</p>
        </div>
      )}
    </div>
  );
}