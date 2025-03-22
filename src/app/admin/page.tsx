"use client";

import React, { useState, useEffect } from 'react';
import { uploadVideo, listVideos, startGlobalStream, getServerStatus } from '../../services/api';
import Link from 'next/link';

interface VideoMetadata {
  name: string;
  duration: number;
  path: string;
}

interface VideoListItem {
  id: string;
  name: string;
  duration: number;
  path: string;
}

export default function AdminPage() {
  const [videoName, setVideoName] = useState('');
  const [videoDuration, setVideoDuration] = useState<number>(60);
  const [videoPath, setVideoPath] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [startStreamError, setStartStreamError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the current stream status
    getServerStatus()
      .then((status) => {
        setIsStreamStarted(status.running);
      })
      .catch((err) => {
        console.error('Error checking stream status:', err);
      });
    
    // Fetch the list of videos
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const { videos: videoData } = await listVideos();
      
      const videoList = Object.entries(videoData).map(([id, metadata]) => ({
        id,
        ...metadata,
      }));
      
      setVideos(videoList);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoName || !videoDuration) {
      setUploadError('Please fill in all required fields.');
      return;
    }
    
    const videoMetadata: VideoMetadata = {
      name: videoName,
      duration: videoDuration,
      path: videoPath || `${videoName.toLowerCase().replace(/\s+/g, '_')}.mp4`
    };
    
    try {
      setIsUploading(true);
      setUploadError(null);
      
      await uploadVideo(videoMetadata);
      
      setUploadSuccess(true);
      setVideoName('');
      setVideoDuration(60);
      setVideoPath('');
      
      // Refetch the videos list
      fetchVideos();
      
      // Reset the success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error uploading video:', err);
      setUploadError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartStream = async () => {
    try {
      setIsLoading(true);
      setStartStreamError(null);
      
      await startGlobalStream();
      
      setIsStreamStarted(true);
    } catch (err) {
      console.error('Error starting stream:', err);
      setStartStreamError('Failed to start the global stream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Video Upload */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Video</h2>
            
            <form onSubmit={handleUploadVideo} className="space-y-4">
              <div>
                <label htmlFor="videoName" className="block mb-1">Video Name</label>
                <input
                  id="videoName"
                  type="text"
                  value={videoName}
                  onChange={(e) => setVideoName(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Enter video name"
                />
              </div>
              
              <div>
                <label htmlFor="videoDuration" className="block mb-1">Duration (seconds)</label>
                <input
                  id="videoDuration"
                  type="number"
                  min="1"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(parseInt(e.target.value))}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Enter duration in seconds"
                />
              </div>
              
              <div>
                <label htmlFor="videoPath" className="block mb-1">Path (optional)</label>
                <input
                  id="videoPath"
                  type="text"
                  value={videoPath}
                  onChange={(e) => setVideoPath(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Enter path (or leave empty for auto-generated)"
                />
                <p className="text-xs text-gray-400 mt-1">
                  In a real app, this would be file upload. For this demo, just provide the file name.
                </p>
              </div>
              
              {uploadError && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded text-sm">
                  {uploadError}
                </div>
              )}
              
              {uploadSuccess && (
                <div className="p-3 bg-green-900/50 border border-green-700 rounded text-sm">
                  Video added successfully!
                </div>
              )}
              
              <button
                type="submit"
                disabled={isUploading}
                className={`px-4 py-2 w-full rounded font-medium ${
                  isUploading
                    ? 'bg-blue-800 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {isUploading ? 'Adding...' : 'Add Video'}
              </button>
            </form>
          </div>
          
          {/* Right Column - Stream Control & Video List */}
          <div className="space-y-8">
            {/* Stream Control */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Stream Control</h2>
              
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isStreamStarted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p>{isStreamStarted ? 'Stream is running' : 'Stream is not running'}</p>
                </div>
              </div>
              
              {!isStreamStarted && (
                <>
                  <button
                    onClick={handleStartStream}
                    disabled={isLoading}
                    className={`px-4 py-2 w-full rounded font-medium ${
                      isLoading
                        ? 'bg-green-800 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } transition-colors`}
                  >
                    {isLoading ? 'Starting...' : 'Start Global Stream'}
                  </button>
                  
                  {startStreamError && (
                    <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded text-sm">
                      {startStreamError}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Video List */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Video Library</h2>
              
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : videos.length === 0 ? (
                <p className="text-center text-gray-400">No videos added yet.</p>
              ) : (
                <div className="space-y-2">
                  {videos.map((video) => (
                    <div key={video.id} className="p-3 bg-gray-700 rounded flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{video.name}</h3>
                        <p className="text-sm text-gray-400">Duration: {formatDuration(video.duration)}</p>
                      </div>
                      <div>
                        <span className="text-xs bg-gray-600 px-2 py-1 rounded">ID: {video.id.slice(0, 6)}...</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 