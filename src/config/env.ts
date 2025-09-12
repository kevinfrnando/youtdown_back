import "dotenv/config";

export const env = {
  PORT: parseInt(process.env.PORT || "3001", 10),
  PUBLIC_DIR: process.env.PUBLIC_DIR || "public/downloads",
  WORKDIR: process.env.WORKDIR || "tmp/yt",
  YTDLP_BIN: process.env.YTDLP_BIN || "yt-dlp",
  FFMPEG_BIN: process.env.FFMPEG_BIN,
  PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || "http://localhost:3001",
};
