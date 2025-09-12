import type { MediaDownloader } from "../../application/ports/MediaDownloader.js";
import type { Storage } from "../../application/ports/Storage.js";
import type { MediaAsset } from "../entities/MediaAsset.js";
import type { MediaRequest } from "../entities/MediaRequest.js";

export class DownloadMedia {
  constructor(private dl: MediaDownloader, private storage: Storage) {}

  async exec(req: MediaRequest): Promise<{ asset: MediaAsset; url: string }> {
    const asset = await this.dl.download(req);
    const persisted = await this.storage.persist(asset);
    const url = this.storage.publicUrl(persisted);
    return {
      asset: persisted,
      url: url,
    };
  }
}
