import express from "express";
import path, { format } from "path";
import { env } from "../../config/env";
import { z } from "zod";
import { MediaFormat, MediaQuality } from "../../core/entities/MediaRequest";
import { randomUUID } from "crypto";
import { YtDlpAdapter } from "../../infrastructure/downloader/YtDlpAdapter";
import { LocalStorageAdapter } from "../../infrastructure/storage/LocalStorageAdapter";
import { DownloadMedia } from "../../core/usecases/DownloadMedia";

export function buildServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.use("/files", express.static(path.resolve(env.PUBLIC_DIR)));

  app.use("/health", (_req, res) => res.json({ ok: true }));

  const Body = z.object({
    url: z
      .string()
      .url()
      .refine(
        (u) => /(youtube\.com|youtu\.be)/.test(u),
        "URL should be from YouTube"
      ),
    format: z
      .enum([
        MediaFormat.MP3,
        MediaFormat.M4A,
        MediaFormat.OPUS,
        MediaFormat.MP4,
        MediaFormat.WEBM,
      ])
      .default(MediaFormat.MP3),
    quality: z
      .enum([
        MediaQuality.BEST,
        MediaQuality.FHD,
        MediaQuality.HD,
        MediaQuality.AUDIO,
      ])
      .default(MediaQuality.AUDIO),
  });

  app.post("/download", async (req, res) => {
    console.log("POST /api/download body:", req.body);
    try {
      const { url, format, quality } = Body.parse(req.body);
      const id = randomUUID();

      const dl = new YtDlpAdapter(env.YTDLP_BIN, env.WORKDIR, env.FFMPEG_BIN);
      const storage = new LocalStorageAdapter(
        env.PUBLIC_DIR,
        env.PUBLIC_BASE_URL
      );
      const useCase = new DownloadMedia(dl, storage);

      const { asset, url: publicUrl } = await useCase.exec({
        id,
        url,
        format,
        quality,
        createdAt: new Date(),
      });

      res.json({
        id,
        filename: asset.filename,
        mime: asset.mime,
        size: asset.sizeBytes,
        url: publicUrl,
      });
    } catch (err: any) {
      console.error("ERROR en /api/download:", err);
      if (err?.issues) {
        return res
          .status(400)
          .json({ error: "Invalid request", details: err.issues });
      }
      console.error(err);
      res.status(500).json({ error: "The file could not be downloaded" });
    }
  });

  app.use((_req, res) => res.status(404).json({ error: "Not found" }));

  return app;
}
