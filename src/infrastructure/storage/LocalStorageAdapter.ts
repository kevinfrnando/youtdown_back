import path from "node:path";
import { Storage } from "../../application/ports/Storage";
import { MediaAsset } from "../../core/entities/MediaAsset";
import fs from "node:fs/promises";

export class LocalStorageAdapter implements Storage {
  constructor(private publicDir: string, private publicBaseUrl: string) {}
  async persist(asset: MediaAsset): Promise<MediaAsset> {
    await fs.mkdir(this.publicDir, { recursive: true });
    const target = path.join(this.publicDir, asset.filename);
    await fs.copyFile(asset.path, target);
    return {
      ...asset,
      path: target,
    };
  }
  publicUrl(asset: MediaAsset): string {
    const base = this.publicBaseUrl.replace(/\/$/, "");
    return `${base}/files/${encodeURIComponent(asset.filename)}`;
  }
}
