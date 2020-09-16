import { FileService, FileStorageService } from './modules/file'
import { ShouldUserAccessProject } from './modules/authorization'
import { userRepo, projectRepo } from './dataAccess'
import { fileRepo } from './infra/sequelize'
import {
  LocalFileStorageService,
  ObjectStorageFileStorageService,
} from './infra/file'

// TODO switch depending on NODE_ENV

let fileStorageService: FileStorageService

if (
  // process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  const authUrl = process.env.OS_AUTH_URL
  const region = process.env.OS_REGION
  const username = process.env.OS_USERNAME
  const password = process.env.OS_PASSWORD
  const container = process.env.OS_CONTAINER

  if (!authUrl || !region || !username || !password || !container) {
    console.log(
      'Cannot start ObjectStorageFileStorageService because of missing environment variables (OS_AUTH_URL, OS_REGION, OS_USERNAME, OS_PASSWORD, OS_CONTAINER)'
    )
    process.exit(1)
  }

  fileStorageService = new ObjectStorageFileStorageService(
    {
      provider: 'openstack',
      keystoneAuthVersion: 'v3',
      authUrl,
      region,
      username,
      password,
      // @ts-ignore
      domainId: 'default',
    },
    container
  )

  console.log(
    'FileService will be using ObjectStorage on container ' + container
  )
} else {
  console.log('FileService will be using LocalFileStorage is userData/')
  fileStorageService = new LocalFileStorageService('userData')
}

const shouldUserAccessProject = new ShouldUserAccessProject(
  userRepo,
  projectRepo.findById
)

export const fileService = new FileService(
  fileStorageService,
  fileRepo,
  shouldUserAccessProject
)
