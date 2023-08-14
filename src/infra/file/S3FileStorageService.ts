import { DeleteObjectCommand, GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { wrapInfra, err, ok, Result } from '../../core/utils';
import { FileStorageService } from '../../modules/file';
import { Readable } from 'stream';

class WrongIdentifierFormat extends Error {
  constructor() {
    super('Identifier is not recognized as S3.');
  }
}

class WrongBucket extends Error {
  constructor() {
    super('The S3 bucket does not match the current bucket.');
  }
}

const IDENTIFIER_PREFIX = 'S3';

function makeIdentifier(filePath: string, bucket: string): string {
  return `${IDENTIFIER_PREFIX}:${bucket}:${filePath}`;
}

function parseIdentifier(fileId: string, _bucket: string): Result<string, WrongIdentifierFormat> {
  if (!fileId || fileId.indexOf(IDENTIFIER_PREFIX) !== 0) {
    return err(new WrongIdentifierFormat());
  }

  const bucket = fileId.substring(IDENTIFIER_PREFIX.length + 1, fileId.lastIndexOf(':'));

  if (bucket !== _bucket) {
    return err(new WrongBucket());
  }

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
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: accessKeyId || '',
      secretAccessKey: secretAccessKey || '',
    },
    forcePathStyle: true,
  });

  return {
    upload({ contents, path: filePath }) {
      return wrapInfra(
        new Upload({
          client: _client,
          params: {
            Bucket: bucket,
            Key: filePath,
            Body: new Readable(contents),
          },
        }).done(),
      ).map(() => makeIdentifier(filePath, bucket));
    },
    download(storedAt) {
      return parseIdentifier(storedAt, bucket).asyncMap(async (remote) => {
        const result = await _client.send(
          new GetObjectCommand({
            Bucket: bucket,
            Key: remote,
          }),
        );

        return Readable.from((await result.Body?.transformToByteArray()) ?? []);
      });
    },

    remove(storedAt) {
      return parseIdentifier(storedAt, bucket)
        .asyncAndThen((remote) =>
          wrapInfra(
            _client.send(
              new DeleteObjectCommand({
                Bucket: bucket,
                Key: remote,
              }),
            ),
          ),
        )
        .map(() => null);
    },
  };
};
