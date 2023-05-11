import { Upload } from '@potentiel/file-storage';
import { Readable } from 'stream';

export type UploadFile = (
  upload: Upload,
) => ({ filePath, content }: { filePath: string; content: Readable }) => Promise<void>;

export const uploadFile: UploadFile =
  (upload) =>
  async ({ filePath, content }) => {
    await upload(filePath, content);
  };
