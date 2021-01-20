import AWS from 'aws-sdk'
import { logger } from '../../core/utils'
import { err, ok, okAsync, Result, ResultAsync } from '../../core/utils/Result'
import { FileStorageService } from '../../modules/file'
import { InfraNotAvailableError } from '../../modules/shared'

class WrongIdentifierFormat extends Error {
  constructor() {
    super('Identifier is not recognized as S3.')
  }
}

class WrongBucket extends Error {
  constructor() {
    super('The S3 bucket does not match the current bucket.')
  }
}

const IDENTIFIER_PREFIX = 'S3'

function makeIdentifier(filePath: string, bucket: string): string {
  return `${IDENTIFIER_PREFIX}:${bucket}:${filePath}`
}

function parseIdentifier(fileId: string, _bucket: string): Result<string, WrongIdentifierFormat> {
  if (!fileId || fileId.indexOf(IDENTIFIER_PREFIX) !== 0) {
    return err(new WrongIdentifierFormat())
  }

  const bucket = fileId.substring(IDENTIFIER_PREFIX.length + 1, fileId.lastIndexOf(':'))

  if (bucket !== _bucket) {
    return err(new WrongBucket())
  }

  return ok(fileId.substring(fileId.lastIndexOf(':') + 1))
}

export const makeS3FileStorageService = (args: {
  endpoint: string
  bucket: string
}): FileStorageService => {
  const { endpoint, bucket } = args
  const _client = new AWS.S3({ endpoint })

  return {
    upload({ contents, path: filePath }) {
      return ResultAsync.fromPromise(
        _client
          .upload({
            Bucket: bucket,
            Key: filePath,
            Body: contents,
          })
          .promise(),
        (e: any) => {
          logger.error(e)
          return new InfraNotAvailableError()
        }
      ).map(() => makeIdentifier(filePath, bucket))
    },

    download(storedAt) {
      return parseIdentifier(storedAt, bucket)
        .map((remote: string) =>
          _client
            .getObject({
              Bucket: bucket,
              Key: remote,
            })
            .createReadStream()
        )
        .asyncAndThen((stream) => okAsync(stream))
    },

    remove(storedAt) {
      return parseIdentifier(storedAt, bucket)
        .asyncAndThen((remote) =>
          ResultAsync.fromPromise(
            _client
              .deleteObject({
                Bucket: bucket,
                Key: remote,
              })
              .promise(),
            (e: any) => {
              logger.error(e)
              return new InfraNotAvailableError()
            }
          )
        )
        .map(() => null)
    },
  }
}
