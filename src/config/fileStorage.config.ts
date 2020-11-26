import { makeLocalFileStorageService, makeS3FileStorageService } from '../infra/file'
import { FileStorageService } from '../modules/file'
import { isProdEnv, isStagingEnv } from './env.config'

let fileStorageService: FileStorageService
if (isStagingEnv || isProdEnv) {
  const { S3_ENDPOINT, S3_BUCKET, AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID } = process.env

  if (!S3_BUCKET || !S3_ENDPOINT || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    console.log(
      'Cannot start S3FileStorageService because of missing environment variables (S3_ENDPOINT, S3_ENDPOINT, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)'
    )
    process.exit(1)
  }

  fileStorageService = makeS3FileStorageService({ endpoint: S3_ENDPOINT, bucket: S3_BUCKET })

  console.log('FileService will be using S3 on bucket ' + S3_BUCKET)
} else {
  console.log('FileService will be using LocalFileStorage is userData/')
  fileStorageService = makeLocalFileStorageService('userData')
}

export { fileStorageService }
