import fs from "node:fs/promises";
import fssync from "node:fs";
import type { MediaDownloader } from "../../application/ports/MediaDownloader.ts";
import type { MediaAsset } from "../../core/entities/MediaAsset.ts";
import type { MediaRequest } from "../../core/entities/MediaRequest.ts";
import path from "node:path";
import { MediaFormat, MediaQuality } from "../../core/entities/MediaRequest";
import { spawn } from "node:child_process";

export class YtDlpAdapter implements MediaDownloader {
  constructor(
    private binPath: string,
    private workDir: string,
    private ffmpegBin?: string
  ) {}
  async download(req: MediaRequest): Promise<MediaAsset> {
    await fs.mkdir(this.workDir, { recursive: true });

    const prefix = `${req.id}-`;
    const outTpl = `${prefix}%(title)s.%(ext)s`;

    const args: string[] = [
      req.url,
      "-o",
      path.join(this.workDir, outTpl),
      "--no-playlist",
    ];

    if (this.ffmpegBin) {
      args.push("--ffmpeg-location", this.ffmpegBin);
    }

    if (
      req.format === MediaFormat.MP3 ||
      req.format === MediaFormat.M4A ||
      req.format === MediaFormat.OPUS
    ) {
      args.push("-x", "--audio-format", req.format);
      if (req.quality === MediaQuality.AUDIO) {
        args.push("-f", "bestaudio/best");
      }
    } else {
      const sel =
        req.quality === MediaQuality.FHD
          ? "bv*[height<=1080]+ba/b"
          : req.quality === MediaQuality.HD
          ? "bv*[height<=720]+ba/b"
          : `bv*+ba/${MediaQuality.BEST}`;
      args.push("-f", sel);
      if (req.format === MediaFormat.MP4) {
        args.push("--remux-video", MediaFormat.MP4);
      }
    }

    await new Promise<void>((resolve, reject) => {
      const proc = spawn(this.binPath, args, { stdio: "inherit" });
      proc.on("error", reject);
      proc.on("exit", (code) =>
        code === 0 ? resolve() : reject(new Error(`yt-dlp exited ${code}`))
      );
    });

    const files = await fs.readdir(this.workDir);
    const match = files
      .filter((f) => f.startsWith(prefix))
      .map((f) => ({
        f,
        t: fssync.statSync(path.join(this.workDir, f)).mtimeMs,
      }))
      .sort((a, b) => b.t - a.t)[0];

    if (!match) throw new Error("Archivo de salida no encontrado");

    const full = path.join(this.workDir, match.f);
    const stat = await fs.stat(full);
    const ext = path.extname(full).replace(".", "");

    return {
      requestId: req.id,
      filename: match.f.replace(prefix, ""),
      mime: mimeFromExt(ext),
      sizeBytes: stat.size,
      path: full,
    };
  }
}

function mimeFromExt(ext: string): string {
  switch (ext) {
    case MediaFormat.MP3:
      return `audio/${MediaFormat.MP3}`;
    case MediaFormat.M4A:
      return `audio/${MediaFormat.M4A}`;
    case MediaFormat.OPUS:
      return `audio/${MediaFormat.OPUS}`;
    case MediaFormat.MP4:
      return `audio/${MediaFormat.MP4}`;
    case MediaFormat.WEBM:
      return `audio/${MediaFormat.WEBM}`;
    default:
      return "application/octet-stream";
  }
}
