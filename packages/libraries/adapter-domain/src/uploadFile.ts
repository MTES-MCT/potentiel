import { Upload } from '@potentiel/file-storage';
import { createReadStream } from 'fs';

export type UploadFile = (upload: Upload) => (path: string) => Promise<void>;

export const uploadFile: UploadFile = (upload) => async (path) => {
  await upload(path, createReadStream(path));
};
