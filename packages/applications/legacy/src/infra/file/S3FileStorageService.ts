import AWS from 'aws-sdk';
import { wrapInfra, ok, okAsync, Result } from '../../core/utils';
import { FileStorageService } from '../../modules/file';

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
  const _client = new AWS.S3({ endpoint, accessKeyId, secretAccessKey, s3ForcePathStyle: true });

  return {
    upload({ contents, path: filePath }) {
      return wrapInfra(
        _client
          .upload({
            Bucket: bucket,
            Key: filePath,
            Body: contents,
          })
          .promise(),
      ).map(() => makeIdentifier(filePath, bucket));
    },

    download(storedAt) {
      return parseIdentifier(storedAt, bucket)
        .map((remote: string) =>
          _client
            .getObject({
              Bucket: bucket,
              Key: remote,
            })
            .createReadStream(),
        )
        .asyncAndThen((stream) => okAsync(stream));
    },

    remove(storedAt) {
      return parseIdentifier(storedAt, bucket)
        .asyncAndThen((remote) =>
          wrapInfra(
            _client
              .deleteObject({
                Bucket: bucket,
                Key: remote,
              })
              .promise(),
          ),
        )
        .map(() => null);
    },
  };
};
