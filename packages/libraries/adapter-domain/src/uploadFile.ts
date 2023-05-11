import { Readable } from 'stream';

export type UploadFile = (
  upload,
) => ({ filePath, content }: { filePath: string; content: Readable }) => Promise<void>;
