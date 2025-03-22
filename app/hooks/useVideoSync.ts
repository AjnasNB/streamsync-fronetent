"use client";

import { useState, useEffect, useRef, RefObject } from 'react';

interface VideoMetadata {
  video_id: string;
  name: string;
  position: number;
  duration: number;
  next_video?: string;
}

interface NextVideoInfo {
  video_id: string;
  name: string;
}

export function useVideoSync(userId: string, videoRef: RefObject<HTMLVideoElement>) {
  const [currentVideo, setCurrentVideo] = useState<VideoMetadata | null>(null);
  const [nextVideo, setNextVideo] = useState<NextVideoInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncTimeRef = useRef<number>(Date.now());

  // Function to fetch current video info
  const fetchCurrentVideo = async () => {
    try {
      setSeeking(true);
      const response = await fetch(`http://localhost:5000/api/get-current-video/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch current video: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update state with new video info
      setCurrentVideo(data);
      setPosition(data.position);
      setDuration(data.duration);
      
      // Set next video if available
      if (data.next_video) {
        setNextVideo({
          video_id: data.next_video,
          name: data.next_video_name || 'Next video'
        });
      }
      
      // Update video element
      if (videoRef.current) {
        // First, check if we need to change the video source
        if (!videoRef.current.src.includes(data.video_id)) {
          videoRef.current.src = `http://localhost:5000/api/stream-video/${data.video_id}`;
          
          // Wait for video to be loaded before setting the current time
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.currentTime = data.position;
              videoRef.current.play().then(() => {
                setIsPlaying(true);
                setSeeking(false);
              }).catch(err => {
                console.error('Error playing video:', err);
                setSeeking(false);
              });
            }
          };
        } else {
          // If it's the same video, just update the current time if needed
          const timeDiff = Math.abs(videoRef.current.currentTime - data.position);
          
          // Only seek if the time difference is significant (more than 1 second)
          if (timeDiff > 1) {
            videoRef.current.currentTime = data.position;
          }
          
          // Ensure the video is playing
          if (videoRef.current.paused) {
            videoRef.current.play().then(() => {
              setIsPlaying(true);
              setSeeking(false);
            }).catch(err => {
              console.error('Error playing video:', err);
              setSeeking(false);
            });
          } else {
            setSeeking(false);
          }
        }
      }
      
      lastSyncTimeRef.current = Date.now();
    } catch (err) {
      console.error('Error fetching current video:', err);
      setSeeking(false);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  // Initial fetch and setup interval for periodic syncing
  useEffect(() => {
    // Fetch initial video info
    fetchCurrentVideo();
    
    // Set up interval for syncing (every 30 seconds)
    syncIntervalRef.current = setInterval(fetchCurrentVideo, 30000);
    
    return () => {
      // Clear interval on cleanup
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [userId]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error('Error playing video:', err);
        });
      }
    }
  };

  // Handle time updates from the video element
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setPosition(videoRef.current.currentTime);
      
      // Check if we've reached the end of the video
      if (videoRef.current.currentTime >= videoRef.current.duration - 0.5) {
        // Time to sync and move to the next video
        fetchCurrentVideo();
      }
    }
  };

  return {
    currentVideo,
    nextVideo,
    isPlaying,
    position,
    duration,
    togglePlay,
    seeking,
    handleTimeUpdate,
    error
  };
} 