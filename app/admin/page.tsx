"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAllVideos, uploadVideo, deleteVideo, clearAllVideos, startStream, stopStream, getServerStatus } from '../services/api';
import { MAX_VIDEO_SIZE, SUPPORTED_VIDEO_FORMATS, API_BASE_URL } from '../config';

export default function AdminPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isStreamRunning, setIsStreamRunning] = useState(false);
  const [videoName, setVideoName] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchVideosAndStatus();
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);
  
  // Set up auto-refresh if enabled
  useEffect(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    if (autoRefresh) {
      refreshTimerRef.current = setInterval(fetchVideosAndStatus, 5000);
    }
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [autoRefresh]);

  const fetchVideosAndStatus = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch videos using a direct API call with cache busting
      console.log("Fetching videos from API...");
      const videosResponse = await fetch(`${API_BASE_URL}/list-videos?_t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (!videosResponse.ok) {
        throw new Error(`Failed to fetch videos: ${videosResponse.status}`);
      }
      
      const videosData = await videosResponse.json();
      console.log("Videos data received:", videosData);
      
      // Process videos
      const processedVideos = processVideosResponse(videosData);
      setVideos(processedVideos);
      
      // Fetch stream status
      console.log("Fetching stream status...");
      const statusResponse = await fetch(`${API_BASE_URL}/status?_t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (!statusResponse.ok) {
        throw new Error(`Failed to fetch status: ${statusResponse.status}`);
      }
      
      const status = await statusResponse.json();
      console.log("Stream status received:", status);
      setIsStreamRunning(status.running);
    } catch (err) {
      console.error("Error in fetchVideosAndStatus:", err);
      setError("Failed to load videos or server status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to process videos response
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Set default video name from file name (without extension)
    const fileName = file.name.split('.')[0];
    setVideoName(fileName);
    
    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!SUPPORTED_VIDEO_FORMATS.includes(`.${fileExtension}`)) {
      setError(`Unsupported file format. Please upload one of: ${SUPPORTED_VIDEO_FORMATS.join(', ')}`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    // Validate file size
    if (file.size > MAX_VIDEO_SIZE) {
      setError(`File size exceeds the maximum allowed size of ${Math.round(MAX_VIDEO_SIZE / (1024 * 1024))}MB`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current || !fileInputRef.current.files || fileInputRef.current.files.length === 0) {
      setError("Please select a file to upload");
      return;
    }
    
    const file = fileInputRef.current.files[0];
    
    try {
      setIsUploading(true);
      setError(null);
      
      // Use uploadVideo with the custom name
      await uploadVideo(file, (progress) => setUploadProgress(progress), videoName);
      
      setSuccess(`Successfully uploaded ${videoName || file.name}`);
      
      // Reset the form
      if (fileInputRef.current) fileInputRef.current.value = '';
      setVideoName('');
      
      // Immediately fetch videos after upload
      await fetchVideosAndStatus();
      
      // Then do another fetch after a delay to ensure processing is complete
      setTimeout(fetchVideosAndStatus, 3000);
    } catch (err) {
      setError(`Failed to upload: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      console.log(`Deleting video with ID: ${videoId}`);
      await deleteVideo(videoId);
      setSuccess("Video deleted successfully");
      
      // Immediately try to refresh the list
      await fetchVideosAndStatus();
      
      // Then fetch again after a short delay to ensure deletion has processed
      setTimeout(fetchVideosAndStatus, 2000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(`Failed to delete video: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllVideos = async () => {
    if (!confirm("Are you sure you want to delete ALL videos? This cannot be undone.")) {
      return;
    }
    
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      console.log("Clearing all videos...");
      await clearAllVideos();
      setSuccess("All videos cleared successfully");
      
      // Refresh the video list with a delay
      setTimeout(fetchVideosAndStatus, 1000);
    } catch (err) {
      console.error("Clear error:", err);
      setError(`Failed to clear videos: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const handleToggleStream = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      if (isStreamRunning) {
        console.log("Admin: Stopping stream...");
        await stopStream();
        console.log("Admin: Stream stop request successful");
        setSuccess("Stream stopped successfully");
        setIsStreamRunning(false);
      } else {
        console.log("Admin: Starting stream...");
        
        // Ensure we have videos before trying to start stream
        if (videos.length === 0) {
          console.error("Admin: Cannot start stream - no videos available");
          setError("Cannot start stream: No videos available. Upload videos first.");
          setIsLoading(false);
          return;
        }
        
        const result = await startStream();
        console.log("Admin: Stream start response:", result);
        setSuccess("Stream started successfully");
        setIsStreamRunning(true);
      }
      
      // Refresh with slight delay to ensure status is updated
      setTimeout(() => {
        console.log("Admin: First refresh after toggle");
        fetchVideosAndStatus();
      }, 1000);
      
      // Double-check status after a bit longer to ensure sync
      setTimeout(() => {
        console.log("Admin: Second refresh after toggle");
        fetchVideosAndStatus();
      }, 3000);
    } catch (err) {
      console.error("Admin: Stream toggle error:", err);
      setError(`Failed to ${isStreamRunning ? 'stop' : 'start'} stream: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Refresh status anyway to make sure UI is in sync with server
      setTimeout(() => {
        console.log("Admin: Error refresh after toggle");
        fetchVideosAndStatus();
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Unknown date' 
      : date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const formatDuration = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return 'Unknown';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderUploadForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload New Video</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Video Name (Optional)
        </label>
        <input
          type="text"
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
          placeholder="Enter custom video name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <p className="text-gray-500 text-xs mt-1">
          Leave blank to use the filename
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Video File
        </label>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={SUPPORTED_VIDEO_FORMATS.join(',')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <p className="text-gray-500 text-xs mt-1">
          Supported formats: {SUPPORTED_VIDEO_FORMATS.join(', ')}
        </p>
        <p className="text-gray-500 text-xs">
          Max size: {Math.round(MAX_VIDEO_SIZE / (1024 * 1024))}MB
        </p>
      </div>
      
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-blue-300"
      >
        {isUploading ? 'Uploading...' : 'Upload Video'}
      </button>
      
      {isUploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm">{uploadProgress}%</p>
        </div>
      )}
    </div>
  );

  // Add auto-refresh toggle to the video manager section
  const renderVideoManager = () => (
    <div className="bg-gray-800 rounded-lg p-6 col-span-1 md:col-span-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Video Manager</h2>
        <div className="flex space-x-3 items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-refresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="auto-refresh" className="text-gray-300 text-sm">
              Auto Refresh
            </label>
          </div>
          <button
            onClick={fetchVideosAndStatus}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={handleClearAllVideos}
            disabled={isLoading || videos.length === 0}
            className={`bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors
              ${(isLoading || videos.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            Clear All
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="mb-2">No videos available</p>
          <p className="text-sm">Upload your first video to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-700">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Title</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Upload Date</th>
                <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id} className="border-b border-gray-700">
                  <td className="px-4 py-3">{video.title}</td>
                  <td className="px-4 py-3">{formatDuration(video.duration)}</td>
                  <td className="px-4 py-3">{formatDate(video.upload_date)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/stream" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              View Stream
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-900 text-white p-4 rounded-lg mb-6">
            <p className="font-medium">{success}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Video Upload Section */}
          <div className="bg-gray-800 rounded-lg p-6 col-span-1">
            {renderUploadForm()}
          </div>
          
          {/* Stream Control Section */}
          <div className="bg-gray-800 rounded-lg p-6 col-span-1">
            <h2 className="text-xl font-semibold text-white mb-4">Stream Control</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isStreamRunning ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                  {isStreamRunning ? 'Running' : 'Stopped'}
                </span>
              </div>
              
              {isStreamRunning && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Synchronized Viewers:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                    All Viewers in Sync
                  </span>
                </div>
              )}
              
              <button
                onClick={handleToggleStream}
                disabled={isLoading || (videos.length === 0 && !isStreamRunning)}
                className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none transition-colors
                  ${isStreamRunning 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  }
                  ${(isLoading || (videos.length === 0 && !isStreamRunning)) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? 'Processing...' : isStreamRunning ? 'Stop Stream' : 'Start Stream'}
              </button>
              
              {videos.length === 0 && !isStreamRunning && (
                <p className="text-yellow-400 text-sm">
                  Upload videos before starting the stream.
                </p>
              )}
              
              {isStreamRunning && (
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-300 font-medium mb-2">
                    Stream Synchronization
                  </p>
                  <p className="text-xs text-gray-400">
                    All viewers are synchronized to the same timeline using our global clock system. Everyone sees the same content at the same time.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Video Manager Section */}
          {renderVideoManager()}
        </div>
      </div>
    </div>
  );
}