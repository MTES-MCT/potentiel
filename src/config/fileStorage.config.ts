import { makeLocalFileStorageService, makeS3FileStorageService } from '../infra/file'
import { FileStorageService } from '@modules/file'
import { isProdEnv, isStagingEnv } from './env.config'

let fileStorageService: FileStorageService
if (isStagingEnv || isProdEnv) {
  const { S3_ENDPOINT, S3_BUCKET } = process.env

  const missingVars = [
    'S3_BUCKET',
    'S3_ENDPOINT',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
  ].filter((key) => !process.env[key])

  if (missingVars.length) {
    const errorMsg = `Cannot start S3FileStorageService because of missing environment variables: ${missingVars.join(
      ', '
    )}`
    console.error(errorMsg)
    process.exit(1)
  }

  fileStorageService = makeS3FileStorageService({ endpoint: S3_ENDPOINT!, bucket: S3_BUCKET! })

  console.log(`FileService will be using S3 on bucket ${S3_BUCKET}`)
} else {
  console.log('FileService will be using LocalFileStorage is userData/')
  fileStorageService = makeLocalFileStorageService('userData')
}

export { fileStorageService }
