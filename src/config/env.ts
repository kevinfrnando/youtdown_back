import "dotenv/config";

export const env = {
  PORT: parseInt(process.env.PORT || "3001", 10),
  PUBLIC_DIR: process.env.PUBLIC_DIR || "public/downloads",
  WORKDIR: process.env.WORKDIR || "tmp/yt",
  YTDLP_BIN: process.env.YTDLP_BIN || "yt-dlp",
  FFMPEG_BIN: process.env.FFMPEG_BIN,
  PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || "http://localhost:3001",
  DEV_CLIENT_URL: process.env.DEV_CLIENT_URL || "http://localhost:5173",
  PROD_CLIENT_URL: process.env.PROD_CLIENT_URL || "https://mi-dominio.com",
  NODE_ENV: process.env.NODE_ENV || "development",
};
