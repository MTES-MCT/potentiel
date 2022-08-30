import { Repository, UniqueEntityID } from '@core/domain'
import { ResultAsync } from '@core/utils'
import { FileObject, makeFileObject } from '../../file'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  IncompleteDataError,
  InfraNotAvailableError,
  OtherError,
} from '../../shared/errors'
import { IllegalProjectDataError, ProjectNotEligibleForCertificateError } from '../errors'
import { Project } from '../Project'
import { User } from '@entities'
import { GetUserById } from '@infra/sequelize/queries/users'

export type GenerateCertificate = (args: {
  projectId: string
  reason?: string
  validateurId?: string
}) => ResultAsync<
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
  fileRepo: Repository<FileObject>
  projectRepo: Repository<Project>
  getUserById: GetUserById
  buildCertificate: ({
    template: CertificateTemplate,
    data: ProjectDataForCertificate,
    validateur: Validateur,
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
export const makeGenerateCertificate =
  ({
    getUserById,
    projectRepo,
    buildCertificate,
    fileRepo,
  }: GenerateCertificateDeps): GenerateCertificate =>
  ({ projectId, reason, validateurId = null }) => {
    return projectRepo
      .load(new UniqueEntityID(projectId))
      .andThen((project) => {
        return getUserById(validateurId).andThen((validateur) =>
          _buildCertificateForProject(project, validateur)
        )
      })
      .andThen(_saveCertificateToStorage)
      .andThen(_addCertificateFileIdToProject)
      .andThen((project) => projectRepo.save(project))

    function _buildCertificateForProject(project: Project, validateur?: User | null) {
      return project.certificateData
        .asyncAndThen((certificateData) => {
          const validateurParDéfaut =
            certificateData.template === 'ppe2.v2'
              ? {
                  fullName: 'Nicolas CLAUSSET',
                  fonction: `Le sous-directeur du système électrique et des énergies renouvelables`,
                }
              : {
                  fullName: 'Ghislain FERRAN',
                  fonction: `L’adjoint au sous-directeur du système électrique et des énergies renouvelables`,
                }
          return buildCertificate({
            ...certificateData,
            validateur: validateur
              ? {
                  fullName: validateur.fullName,
                  fonction: validateur.fonction,
                }
              : validateurParDéfaut,
          })
        })
        .map((fileStream) => ({ fileStream, project }))
    }

    function _saveCertificateToStorage(args: {
      fileStream: NodeJS.ReadableStream
      project: Project
    }) {
      const { fileStream, project } = args
      return makeFileObject({
        filename: project.certificateFilename,
        contents: fileStream,
        forProject: new UniqueEntityID(projectId),
        designation: 'attestation-designation',
      })
        .mapErr((e) => new OtherError(e.message))
        .asyncAndThen((file: FileObject) => {
          return fileRepo.save(file).map(() => file.id.toString())
        })
        .map((certificateFileId) => ({ certificateFileId, project }))
    }

    function _addCertificateFileIdToProject(args: { certificateFileId: string; project: Project }) {
      const { certificateFileId, project } = args
      return project
        .addGeneratedCertificate({
          projectVersionDate: project.lastUpdatedOn || new Date(),
          certificateFileId,
          reason,
        })
        .map(() => project)
    }
  }
