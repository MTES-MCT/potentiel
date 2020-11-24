import { Repository, UniqueEntityID } from '../../../core/domain'
import { ResultAsync } from '../../../core/utils'
import { makeProjectFilePath } from '../../../helpers/makeProjectFilePath'
import { File, FileService } from '../../file'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  IncompleteDataError,
  InfraNotAvailableError,
  OtherError,
} from '../../shared/errors'
import { IllegalProjectDataError, ProjectNotEligibleForCertificateError } from '../errors'
import { Project } from '../Project'

export type GenerateCertificate = (
  projectId: string
) => ResultAsync<
  null,
  | EntityNotFoundError
  | InfraNotAvailableError
  | IncompleteDataError
  | ProjectNotEligibleForCertificateError
  | OtherError
  | AggregateHasBeenUpdatedSinceError
>

/* global NodeJS */
interface GenerateCertificateDeps {
  fileService: FileService
  projectRepo: Repository<Project>
  buildCertificate: ({
    template: CertificateTemplate,
    data: ProjectDataForCertificate,
  }) => ResultAsync<
    NodeJS.ReadableStream,
    | IllegalProjectDataError
    | OtherError
    | EntityNotFoundError
    | IncompleteDataError
    | AggregateHasBeenUpdatedSinceError
    | ProjectNotEligibleForCertificateError
    | InfraNotAvailableError
  >
}
export const makeGenerateCertificate = (deps: GenerateCertificateDeps): GenerateCertificate => (
  projectId
) => {
  return deps.projectRepo
    .load(new UniqueEntityID(projectId))
    .andThen(_buildCertificateForProject)
    .andThen(_saveCertificateToStorage)
    .andThen(_addCertificateFileIdToProject)
    .andThen((project) => deps.projectRepo.save(project))

  function _buildCertificateForProject(project: Project) {
    return project.certificateData
      .asyncAndThen((certificateData) => deps.buildCertificate(certificateData))
      .map((fileStream) => ({ fileStream, project }))
  }

  function _saveCertificateToStorage(args: {
    fileStream: NodeJS.ReadableStream
    project: Project
  }) {
    const { fileStream, project } = args
    return File.create({
      filename: project.certificateFilename,
      forProject: projectId,
      createdBy: '',
      designation: 'attestation-designation',
    })
      .asyncAndThen((file: File) => {
        return deps.fileService
          .save(file, {
            path: makeProjectFilePath(projectId, file.filename).filepath,
            stream: fileStream,
          })
          .map(() => file.id.toString())
      })
      .map((certificateFileId) => ({ certificateFileId, project }))
  }

  function _addCertificateFileIdToProject(args: { certificateFileId: string; project: Project }) {
    const { certificateFileId, project } = args
    return project
      .addGeneratedCertificate({
        projectVersionDate: project.lastUpdatedOn,
        certificateFileId,
      })
      .map(() => project)
  }
}
