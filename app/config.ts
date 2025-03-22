"use client";

// Configuration for StreamSync application

// API base URL - uses environment variable if available, otherwise fallback to localhost
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Video Upload Configuration
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB in bytes
export const SUPPORTED_VIDEO_FORMATS = ['.mp4', '.webm', '.mov', '.avi'];

// Application Information
export const APP_NAME = 'StreamSync';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'A personalized video streaming platform';

// Other constants
export const DEFAULT_THEME = 'dark';
export const DEFAULT_LANGUAGE = 'en'; 