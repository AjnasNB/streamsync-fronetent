"use client";

// Define the API Base URL based on environment
let API_BASE_URL: string;

// Determine if we're running in the browser or during build
if (typeof window !== 'undefined') {
  // Client-side: Use the current hostname with the API port
  const hostname = window.location.hostname;
  const isDevelopment = 
    process.env.NODE_ENV === 'development' || 
    hostname === 'localhost' || 
    hostname === '127.0.0.1';
  
  // Use the exact port in development, but in production assume API is on same domain
  API_BASE_URL = isDevelopment 
    ? `http://${hostname}:5000/api` 
    : '/api';
  
  console.log(`Using API Base URL: ${API_BASE_URL}`);
} else {
  // Server-side: use the API URL from environment or default
  API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
}

interface UserPreferences {
  contentType?: string[];
  language?: string;
  quality?: string;
}

interface VideoMetadata {
  name: string;
  duration: number;
  path: string;
}

export interface Video {
  id: string;
  name: string;
  path: string;
  created_at: number;
  duration?: number;
  width?: number;
  height?: number;
  codec?: string;
  bitrate?: number;
  hls_url?: string;
  thumbnail_url?: string;
}

// API error handling helper
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// User Registration and Management
export const registerUser = async (): Promise<{ user_id: string }> => {
  try {
    console.log("Registering new user");
    const response = await fetch(`${API_BASE_URL}/register-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preferences: {} }),
    });
    
    console.log(`Registration response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error('Failed to register user');
    }
    
    const data = await response.json();
    console.log("Registration response data:", data);
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const getUserId = (): string | null => {
  return localStorage.getItem('streamSync_userId');
};

export const storeUserId = (userId: string): void => {
  localStorage.setItem('streamSync_userId', userId);
};

// Video Management
export const uploadVideo = async (
  file: File, 
  onProgress?: (progress: number) => void,
  customName?: string
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', customName || file.name.split('.')[0]);
  
  const xhr = new XMLHttpRequest();
  
  xhr.open('POST', `${API_BASE_URL}/upload-video-file`);
  
  if (onProgress) {
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });
  }
  
  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error('Upload failed'));
      }
    };
    
    xhr.onerror = () => {
      reject(new Error('Network error during upload'));
    };
    
    xhr.send(formData);
  });
};

export const getAllVideos = async (): Promise<any[]> => {
  try {
    console.log("Fetching all videos");
    const response = await fetch(`${API_BASE_URL}/list-videos`);
    
    if (!response.ok) {
      // Fallback to the old endpoint if the new one doesn't exist
      const fallbackResponse = await fetch(`${API_BASE_URL}/videos`);
      if (!fallbackResponse.ok) {
        throw new Error(`Failed to fetch videos: ${fallbackResponse.status}`);
      }
      return processVideosResponse(await fallbackResponse.json());
    }
    
    const data = await response.json();
    console.log("Videos response data:", data);
    return processVideosResponse(data);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

// Helper function to process the videos response
function processVideosResponse(data: any): any[] {
  // The backend returns videos as an object with video IDs as keys
  if (data && data.videos && typeof data.videos === 'object') {
    // Convert the object to an array of videos with IDs
    return Object.entries(data.videos).map(([id, metadata]: [string, any]) => ({
      id,
      title: metadata.name,
      name: metadata.name,
      path: metadata.path,
      duration: metadata.duration || 0,
      width: metadata.width,
      height: metadata.height,
      codec: metadata.codec,
      bitrate: metadata.bitrate,
      upload_date: metadata.upload_date || new Date().toISOString(),
      file_exists: metadata.file_exists !== undefined ? metadata.file_exists : true,
      original_filename: metadata.original_filename || metadata.name
    }));
  }
  
  return [];
}

export const deleteVideo = async (videoId: string): Promise<void> => {
  try {
    console.log(`Attempting to delete video with ID: ${videoId}`);
    const response = await fetch(`${API_BASE_URL}/video/${videoId}`, {
      method: 'DELETE',
    });
    
    console.log(`Delete video response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Failed to delete video: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
};

export const clearAllVideos = async (): Promise<void> => {
  try {
    console.log("Attempting to clear all videos");
    const response = await fetch(`${API_BASE_URL}/clear-videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Clear videos response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Failed to clear videos: ${response.status}`);
    }
  } catch (error) {
    console.error("Error clearing videos:", error);
    throw error;
  }
};

// Stream Management
export const startStream = async () => {
  try {
    console.log("API: Attempting to start global stream");
    const response = await fetch(`${API_BASE_URL}/start-global-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`API: Start stream response status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API: Start stream error response:", errorData);
      throw new Error(errorData.error || `Failed to start stream: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API: Start stream success response:", data);
    return data;
  } catch (error) {
    console.error("API: Error starting stream:", error);
    throw error;
  }
};

export const stopStream = async () => {
  try {
    console.log("API: Attempting to stop global stream");
    const response = await fetch(`${API_BASE_URL}/stop-global-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`API: Stop stream response status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API: Stop stream error response:", errorData);
      throw new Error(errorData.error || `Failed to stop stream: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API: Stop stream success response:", data);
    return data;
  } catch (error) {
    console.error("API: Error stopping stream:", error);
    throw error;
  }
};

export const getServerStatus = async (): Promise<{ running: boolean }> => {
  try {
    console.log("API: Fetching server status");
    const response = await fetch(`${API_BASE_URL}/status`);
    
    console.log(`API: Server status response code: ${response.status}`);
    
    if (!response.ok) {
      console.error(`API: Failed to get server status: ${response.status}`);
      throw new Error(`Failed to get server status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API: Server status data:", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("API: Error fetching server status:", error);
    throw error;
  }
};

// Video Playback
export const getCurrentVideo = async (userId: string) => {
  if (!userId) {
    console.error('getCurrentVideo: userId is required');
    throw new Error('User ID is required');
  }

  try {
    console.log(`Fetching current video for user: ${userId}`);
    const response = await fetch(`${API_BASE_URL}/get-current-video/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log(`getCurrentVideo response status: ${response.status}`);
    
    if (response.status === 404) {
      const errorData = await response.json();
      console.log('No current video:', errorData.message);
      
      if (errorData.message?.includes('User not found')) {
        throw new Error('User not registered. Please refresh the page.');
      } else if (errorData.message?.includes('No videos')) {
        throw new Error('No videos available in the stream.');
      } else {
        throw new Error(errorData.message || 'Video not found');
      }
    }
    
    if (response.status === 400) {
      const errorData = await response.json();
      console.log('Bad request:', errorData.message);
      throw new Error(errorData.message || 'Stream has not started');
    }
    
    if (!response.ok) {
      throw new Error(`Failed to get current video: ${response.status}`);
    }

    const data = await response.json();
    console.log('Current video data:', data);
    
    if (!data || !data.video_id) {
      console.log('No video currently playing');
      throw new Error('No video currently playing');
    }

    // Get client time to calculate precise sync offset
    const clientTime = Date.now();
    const serverTime = data.server_time;
    const timeOffset = serverTime - clientTime;
    
    console.log(`Time synchronization: offset=${timeOffset}ms, server=${serverTime}, client=${clientTime}`);

    return {
      id: data.video_id,
      title: data.title || 'Untitled Video',
      stream_start_time: data.stream_start_time,
      duration: data.duration || 0,
      position: data.position || 0,
      sync_interval: data.sync_interval || 2000,
      force_sync: data.force_sync || false,
      elapsed_total: data.elapsed_total || 0,
      next_video: data.next_video,
      time_until_next: data.time_until_next,
      playlist_duration: data.playlist_duration,
      playlist_position: data.playlist_position,
      hls_enabled: data.hls_enabled || false,
      hls_url: data.hls_url || null,
      thumbnail_url: data.thumbnail_url || null,
      server_time: serverTime,
      bufferAheadTime: data.buffer_ahead_time || 30,
      performanceMode: data.performance_mode || 'smooth'
    };
  } catch (error) {
    console.error('Error fetching current video:', error);
    throw error;
  }
};

export const getNextVideo = async (userId: string): Promise<any> => {
  try {
    console.log(`Fetching next video for user: ${userId}`);
    const response = await fetch(`${API_BASE_URL}/get-next-video/${userId}`);
    
    console.log(`Get next video response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get next video: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Next video response data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching next video:", error);
    throw error;
  }
};

// Legacy functions - keeping for backward compatibility
export const listVideos = getAllVideos;
export const clearVideos = clearAllVideos;
export const startGlobalStream = startStream;

// Helper function to get the video stream URL
export const getVideoStreamUrl = (
  videoId: string | undefined | null,
  useHls: boolean = true,
  hlsUrl?: string | null
): string | null => {
  if (!videoId) {
    console.warn('getVideoStreamUrl: videoId is missing or undefined');
    return null;
  }

  // If we have a specific HLS URL and we want to use HLS, use it directly
  if (useHls && hlsUrl) {
    return hlsUrl;
  }

  // Otherwise, fall back to the standard HLS endpoint or direct stream
  if (useHls) {
    return `${API_BASE_URL}/stream-hls/${videoId}/master.m3u8`;
  }
  
  // Direct stream fallback
  return `${API_BASE_URL}/stream-video/${videoId}`;
};

export const getVideoThumbnailUrl = (videoId: string, thumbnailFile: string = "thumbnail.jpg"): string => {
  try {
    return `${API_BASE_URL}/thumbnails/${videoId}/${thumbnailFile}`;
  } catch (error) {
    console.error("Error generating thumbnail URL:", error);
    return "";
  }
} 