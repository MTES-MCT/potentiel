import { BaseShouldUserAccessProject } from '../modules/authorization'
import { userRepo, projectRepo, fileRepo } from './repos.config'
import { makeGenerateCertificate } from '../modules/project/generateCertificate'
import { buildCertificate } from '../views/certificates'
import { fileStorageService } from './fileStorage.config'
import { FileService } from '../modules/file'

export const shouldUserAccessProject = new BaseShouldUserAccessProject(
  userRepo,
  projectRepo.findById
)

export const fileService = new FileService(
  fileStorageService,
  fileRepo,
  shouldUserAccessProject
)

export const generateCertificate = makeGenerateCertificate({
  fileService,
  findProjectById: projectRepo.findById,
  saveProject: projectRepo.save,
  buildCertificate,
})
