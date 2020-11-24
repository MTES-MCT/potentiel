import { BaseShouldUserAccessProject } from '../modules/authorization'
import { FileService } from '../modules/file'
import { makeCorrectProjectData, makeGenerateCertificate } from '../modules/project/useCases'
import { buildCertificate } from '../views/certificates'
import { fileStorageService } from './fileStorage.config'
import { fileRepo, oldProjectRepo, projectRepo, userRepo } from './repos.config'

export const shouldUserAccessProject = new BaseShouldUserAccessProject(
  userRepo,
  oldProjectRepo.findById
)

export const fileService = new FileService(fileStorageService, fileRepo, shouldUserAccessProject)

export const generateCertificate = makeGenerateCertificate({
  fileService,
  projectRepo,
  buildCertificate,
})

export const correctProjectData = makeCorrectProjectData({
  fileService,
  projectRepo,
  generateCertificate,
})
