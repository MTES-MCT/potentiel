import { DeleteObjectCommand, GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { wrapInfra, ok, okAsync, Result, errAsync } from '../../core/utils';
import { FileAccessDeniedError, FileNotFoundError, FileStorageService } from '../../modules/file';
import { Readable } from 'stream';

class WrongIdentifierFormat extends Error {
  constructor() {
    super('Identifier is not recognized as S3.');
  }
}

const IDENTIFIER_PREFIX = 'S3';

function makeIdentifier(filePath: string, bucket: string): string {
  return `${IDENTIFIER_PREFIX}:${bucket}:${filePath}`;
}

function parseIdentifier(fileId: string, _bucket: string): Result<string, WrongIdentifierFormat> {
  return ok(fileId.substring(fileId.lastIndexOf(':') + 1));
}

export const makeS3FileStorageService = (args: {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  bucket: string;
}): FileStorageService => {
  const { accessKeyId, secretAccessKey, endpoint, bucket } = args;
  const _client = new S3({
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  return {
    upload({ contents, path: filePath }) {
      return wrapInfra(
        new Promise(async () => {
          return new Upload({
            client: _client,
            params: {
              Bucket: bucket,
              Key: filePath,
              Body: await mapToReadableStream(contents),
            },
          }).done();
        }),
      ).map(() => makeIdentifier(filePath, bucket));
    },

    download(storedAt) {
      return parseIdentifier(storedAt, bucket).asyncAndThen((remote: string) =>
        wrapInfra(
          new Promise(async () => {
            try {
              const result = await _client.send(
                new GetObjectCommand({ Bucket: bucket, Key: remote }),
              );

              if (!result.Body) {
                return errAsync(new FileNotFoundError());
              }

              const newLocal = Readable.from(await result.Body.transformToString());
              return okAsync(newLocal);
            } catch (e) {
              return errAsync(new FileAccessDeniedError());
            }
          }),
        ),
      );
    },

    remove(storedAt) {
      return parseIdentifier(storedAt, bucket).asyncAndThen((remote: string) =>
        wrapInfra(
          new Promise(async () => {
            try {
              const result = await _client.send(
                new DeleteObjectCommand({ Bucket: bucket, Key: remote }),
              );

              return okAsync(null);
            } catch (e) {
              return okAsync(null);
            }
          }),
        ),
      );
    },
  };
};

const mapToReadableStream = async (
  oldReadableStream: NodeJS.ReadableStream,
): Promise<ReadableStream> => {
  return new ReadableStream({
    start: async (controller) => {
      controller.enqueue(await mapToBuffer(oldReadableStream));
      controller.close();
    },
  });
};

const mapToBuffer = async (oldReadableStream: NodeJS.ReadableStream): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const buffer = Array<Uint8Array>();

    oldReadableStream.on('data', (chunk) => buffer.push(chunk));
    oldReadableStream.on('end', () => resolve(Buffer.concat(buffer)));
    oldReadableStream.on('error', (err) => reject(`error converting stream - ${err}`));
  });
};
