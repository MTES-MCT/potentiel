import { BaseShouldUserAccessProject } from '../modules/authorization'
import { makeLoadFileForUser } from '../modules/file'
import { makeCorrectProjectData, makeGenerateCertificate } from '../modules/project/useCases'
import { buildCertificate } from '../views/certificates'
import { fileRepo, oldProjectRepo, projectRepo, userRepo } from './repos.config'
import { getFileProject } from './queries.config'

export const shouldUserAccessProject = new BaseShouldUserAccessProject(
  userRepo,
  oldProjectRepo.findById
)

export const generateCertificate = makeGenerateCertificate({
  fileRepo,
  projectRepo,
  buildCertificate,
})

export const correctProjectData = makeCorrectProjectData({
  fileRepo,
  projectRepo,
  generateCertificate,
})

export const loadFileForUser = makeLoadFileForUser({
  fileRepo,
  shouldUserAccessProject,
  getFileProject,
})
