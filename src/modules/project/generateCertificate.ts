import { DomainError } from '../../core/domain'
import {
  err,
  errAsync,
  fromOldResultAsync,
  ResultAsync,
} from '../../core/utils'
import { ProjectRepo } from '../../dataAccess'
import {
  applyProjectUpdate,
  CertificateTemplate,
  getCertificateIfProjectEligible,
  Project,
} from '../../entities'
import { makeProjectFilePath } from '../../helpers/makeProjectFilePath'
import { File, FileService } from '../file'
import {
  EntityNotFoundError,
  InfraNotAvailableError,
  OtherError,
} from '../shared/errors'
import { makeCertificateFilename } from './utils'

export class ProjectNotEligibleForCertificateError extends DomainError {
  constructor() {
    super('Impossible de générer une attestation pour ce projet.')
  }
}

// Possible errors:
// - Failing to get project information (from findByProjectId)
// - Failing to generate PDF (from buildCertificate)
// - Failing to save PDF file (from fileService.save)
export type GenerateCertificate = (
  projectId: Project['id'],
  notifiedOn?: Project['notifiedOn']
) => ResultAsync<Project['certificateFileId'], DomainError>

interface GenerateCertificateDeps {
  fileService: FileService
  findProjectById: ProjectRepo['findById']
  saveProject: ProjectRepo['save']
  buildCertificate: (
    template: CertificateTemplate,
    project: Project
  ) => ResultAsync<NodeJS.ReadableStream, Error>
}
export const makeGenerateCertificate = (
  deps: GenerateCertificateDeps
): GenerateCertificate => (
  projectId: Project['id'],
  notifiedOn?: Project['notifiedOn']
) => {
  let project: Project
  let file: File
  // console.log('generaticeCertificate called for project', projectId)
  return ResultAsync.fromPromise(
    deps.findProjectById(projectId),
    () => new InfraNotAvailableError()
  )
    .andThen((_project: Project | undefined) => {
      if (!_project) {
        console.log(
          'Error: generaticeCertificate could not find project',
          projectId
        )
        return err(new EntityNotFoundError())
      }

      project = _project

      if (notifiedOn) project.notifiedOn = notifiedOn

      // Generate PDF for Certificate

      const certificateTemplate = getCertificateIfProjectEligible(
        project,
        !!notifiedOn
      )
      // Make sure the project can have a certificate (notifiedOn, classe, periode)
      if (!certificateTemplate) {
        console.log(
          'Error: generaticeCertificate could not generate certificate for project because it is not eligible for a certificate.',
          projectId
        )
        return err(new ProjectNotEligibleForCertificateError())
      }

      // console.log('generaticeCertificate building certificate', projectId)
      return deps.buildCertificate(certificateTemplate, project)
    })
    .andThen((fileStream: NodeJS.ReadableStream) => {
      // Save PDF File to storage
      return File.create({
        filename: makeCertificateFilename(project),
        forProject: projectId,
        createdBy: '',
        designation: 'attestation-designation',
      }).asyncAndThen((_file: File) => {
        file = _file
        return deps.fileService.save(file, {
          path: makeProjectFilePath(projectId, file.filename).filepath,
          stream: fileStream,
        })
      })
    })
    .map(() => {
      // console.log(
      //   'generaticeCertificate done saving certificate file',
      //   projectId
      // )
      return file.id.toString()
    })
}
