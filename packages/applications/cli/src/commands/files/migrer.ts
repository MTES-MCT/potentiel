import { Command } from '@oclif/core';

import { getClient } from '@potentiel-libraries/file-storage';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

export default class FilesMigrer extends Command {
  description = 'Migrer les fichiers du S3 vers la DB';
  async run() {
    const client = getClient();

    let size = 0;
    let count = 0;
    let continuationToken: string | undefined;

    do {
      const response = await client.listObjectsV2({
        Bucket: 'production-potentiel',
        ContinuationToken: continuationToken,
      });

      for (const object of response.Contents ?? []) {
        const key = object.Key;
        if (!key) continue;
        size += object.Size!;
        count++;

        const result = await getClient().getObject({
          Bucket: 'production-potentiel',
          Key: key,
        });
        await insertFile(key, Buffer.from(await result.Body!.transformToByteArray()));
      }

      continuationToken = response.NextContinuationToken;
      console.log(continuationToken);
      return;
    } while (continuationToken);

    console.log(size, 'bytes');
    console.log(count, 'files');
  }
}

const insertFile = async (key: string, buffer: Buffer) => {
  await executeQuery(
    `
    insert into files.file (key, content)
    values ($1, $2)
  `,
    [key, buffer],
  );
};
