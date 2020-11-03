import { DomainError } from '../../core/domain'
import { err, ResultAsync } from '../../core/utils'
import { ProjectRepo } from '../../dataAccess'
import { CertificateTemplate, getCertificateIfProjectEligible, Project } from '../../entities'
import { makeProjectFilePath } from '../../helpers/makeProjectFilePath'
import { File, FileService } from '../file'
import { EntityNotFoundError, InfraNotAvailableError } from '../shared/errors'
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
  notifiedOn?: Project['notifiedOn'],
  project?: Project
) => ResultAsync<Project['certificateFileId'], DomainError>

/* global NodeJS */
interface GenerateCertificateDeps {
  fileService: FileService
  findProjectById: ProjectRepo['findById']
  saveProject: ProjectRepo['save']
  buildCertificate: (
    template: CertificateTemplate,
    project: Project
  ) => ResultAsync<NodeJS.ReadableStream, Error>
}
export const makeGenerateCertificate = (deps: GenerateCertificateDeps): GenerateCertificate => (
  projectId,
  notifiedOn,
  _project
) => {
  return ResultAsync.fromPromise(
    _project ? Promise.resolve(_project) : deps.findProjectById(projectId),
    () => new InfraNotAvailableError()
  )
    .andThen((project: Project | undefined) => {
      if (!project) {
        console.log('Error: generaticeCertificate could not find project', projectId)
        return err(new EntityNotFoundError())
      }

      if (notifiedOn) project.notifiedOn = notifiedOn

      // Generate PDF for Certificate

      const certificateTemplate = getCertificateIfProjectEligible(project, !!notifiedOn)
      // Make sure the project can have a certificate (notifiedOn, classe, periode)
      if (!certificateTemplate) {
        console.log(
          'Error: generaticeCertificate could not generate certificate for project because it is not eligible for a certificate.',
          projectId
        )
        return err(new ProjectNotEligibleForCertificateError())
      }

      return deps
        .buildCertificate(certificateTemplate, project)
        .map((fileStream) => ({ fileStream, project }))
    })
    .andThen(({ fileStream, project }) => {
      // Save PDF File to storage
      return File.create({
        filename: makeCertificateFilename(project),
        forProject: projectId,
        designation: 'attestation-designation',
      }).asyncAndThen((file: File) => {
        return deps.fileService
          .save(file, {
            path: makeProjectFilePath(projectId, file.filename).filepath,
            stream: fileStream,
          })
          .map(() => file)
      })
    })
    .map((file) => {
      return file.id.toString()
    })
}
