export enum MediaFormat {
  MP3 = "mp3",
  M4A = "m4a",
  OPUS = "opus",
  MP4 = "mp4",
  WEBM = "webm",
}

export enum MediaQuality {
  BEST = "best",
  FHD = "1080",
  HD = "720",
  AUDIO = "audio",
}

export interface MediaRequest {
  id: string;
  url: string;
  format: MediaFormat;
  quality?: MediaQuality;
  createdAt: Date;
}
