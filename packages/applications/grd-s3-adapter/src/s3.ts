import { Parser } from '@json2csv/plainjs';

import { upload } from '@potentiel-libraries/file-storage';

export type UploadToS3Props<T> = {
  data: T;
};
export const uploadToS3 = async <TRaw extends object>({ data }: UploadToS3Props<TRaw>) => {
  const csvParser = new Parser({ delimiter: ';' });
  const csv = csvParser.parse(data);
  const fileName = `export_raccordement_en_attente_mise_en_service.csv`;

  const content = new ReadableStream({
    start: async (controller) => {
      controller.enqueue(Buffer.from(csv, 'utf-8'));
      controller.close();
    },
  });

  await upload(fileName, content);
};
