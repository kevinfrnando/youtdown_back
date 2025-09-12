import type { MediaAsset } from "../../core/entities/MediaAsset.js";
import type { MediaRequest } from "../../core/entities/MediaRequest.js";

export interface MediaDownloader {
  download(req: MediaRequest): Promise<MediaAsset>;
}
