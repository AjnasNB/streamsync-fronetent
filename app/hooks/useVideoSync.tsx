"use client";

import { useState, useEffect, useCallback } from 'react';
import { getCurrentVideo, getNextVideo } from '../services/api';

export function useVideoSync(userId: string, onError?: (error: any) => void, liveMode: boolean = false) {
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [nextVideo, setNextVideo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the current video for this user
  const fetchCurrentVideo = useCallback(async () => {
    if (!userId) return;
    
    try {
      console.log(`Fetching current video for user: ${userId}`);
      const videoData = await getCurrentVideo(userId);
      console.log("Current video data:", videoData);
      
      if (videoData && videoData.video_id) {
        setCurrentVideo({
          videoId: videoData.video_id,
          title: videoData.name || "Untitled Video",
          timestamp: videoData.position || 0
        });
      } else {
        console.log("No current video available");
        setCurrentVideo(null);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching current video:", error);
      if (onError) onError(error);
      setIsLoading(false);
    }
  }, [userId, onError]);

  // Fetch the next video for this user
  const fetchNextVideo = useCallback(async () => {
    if (!userId) return;
    
    try {
      const videoData = await getNextVideo(userId);
      console.log("Next video data:", videoData);
      
      if (videoData && videoData.video_id) {
        setNextVideo({
          videoId: videoData.video_id,
          title: videoData.name || "Untitled Video"
        });
      } else {
        setNextVideo(null);
      }
    } catch (error) {
      console.error("Error fetching next video:", error);
      // Don't trigger onError for next video failures
    }
  }, [userId]);

  // Initial fetch of current and next videos
  useEffect(() => {
    if (userId) {
      fetchCurrentVideo();
      if (!liveMode) {
        fetchNextVideo();
      }
    }
  }, [userId, fetchCurrentVideo, fetchNextVideo, liveMode]);

  // Set up periodic refresh for live mode
  useEffect(() => {
    if (!userId || !liveMode) return;
    
    const refreshInterval = setInterval(() => {
      if (document.visibilityState !== 'hidden') {
        fetchCurrentVideo();
      }
    }, 5000); // Check for updates every 5 seconds in live mode
    
    return () => clearInterval(refreshInterval);
  }, [userId, fetchCurrentVideo, liveMode]);

  // Function to proceed to the next video
  const proceedToNextVideo = useCallback(() => {
    if (liveMode) {
      // In live mode, just refresh the current video
      fetchCurrentVideo();
      return;
    }
    
    if (nextVideo) {
      setCurrentVideo({
        videoId: nextVideo.videoId,
        title: nextVideo.title,
        timestamp: 0
      });
      
      setNextVideo(null);
      fetchNextVideo();
    } else {
      fetchCurrentVideo();
      fetchNextVideo();
    }
  }, [nextVideo, fetchCurrentVideo, fetchNextVideo, liveMode]);

  return {
    currentVideo,
    nextVideo: liveMode ? null : nextVideo, // Don't expose next video in live mode
    isLoading,
    proceedToNextVideo
  };
} 