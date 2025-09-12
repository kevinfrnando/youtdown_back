import type { MediaAsset } from "../../core/entities/MediaAsset.js";

export interface Storage {
  persist(asset: MediaAsset): Promise<MediaAsset>;
  publicUrl(asset: MediaAsset): string;
}
