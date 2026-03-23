import PizZip from 'pizzip';
import { extension } from 'mime-types';

export const zipDocuments = async (
  documents: Blob[],
  options: Omit<PizZip.GenerateOptions, 'type'> = {
    compression: 'DEFLATE',
    mimeType: 'application/zip',
  },
) => {
  const zip = new PizZip();

  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    const arrayBuffer = await document.arrayBuffer();

    zip.file(`document-${i}.${extension(document.type)}`, arrayBuffer);
  }

  return zip.generate({ ...options, type: 'blob' });
};
