
export type VideoRatio = '16:9' | '9:16' | '1:1';
export type VideoResolution = '720p' | '1080p';
export type VideoStyle = 'Realistic' | 'Cinematic' | 'Anime' | 'Motion Graphic';

export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  ratio: VideoRatio;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface GenerationSettings {
  ratio: VideoRatio;
  resolution: VideoResolution;
  style: VideoStyle;
  duration: string;
  fps: number;
}
