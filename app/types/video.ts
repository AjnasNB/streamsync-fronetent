export interface Video {
  id: string;
  title: string;
  position?: number;
  duration?: number;
  nextVideo?: string;
  timeUntilNext?: number;
  hlsEnabled?: boolean;
  hlsUrl?: string;
  thumbnailUrl?: string;
  streamStartTime?: number;
  bufferAheadTime?: number;
  performanceMode?: 'smooth' | 'aggressive';
} 