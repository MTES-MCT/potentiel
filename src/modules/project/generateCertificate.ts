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

const wait = (time: number) =>
  ResultAsync.fromPromise(
    new Promise((resolve) => {
      setTimeout(resolve, time)
    }),
    () => new OtherError('blah')
  )

export class GenerateCertificate {
  constructor(
    private fileService: FileService,
    private findProjectById: ProjectRepo['findById'],
    private saveProject: ProjectRepo['save'],
    private buildCertificate: (
      template: CertificateTemplate,
      project: Project
    ) => ResultAsync<NodeJS.ReadableStream, Error>
  ) {}

  public execute(projectId: Project['id']): ResultAsync<null, DomainError> {
    // Get project information

    let project: Project
    let file: File
    return ResultAsync.fromPromise(
      this.findProjectById(projectId),
      () => new InfraNotAvailableError()
    )
      .andThen((_project: Project | undefined) => {
        if (!_project) {
          return err(new EntityNotFoundError())
        }

        project = _project

        // Generate PDF for Certificate

        const certificateTemplate = getCertificateIfProjectEligible(project)
        // Make sure the project can have a certificate (notifiedOn, classe, periode)
        if (!certificateTemplate) {
          return err(new ProjectNotEligibleForCertificateError())
        }

        return this.buildCertificate(certificateTemplate, project)
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
          return this.fileService.save(file, {
            path: makeProjectFilePath(projectId, file.filename).filepath,
            stream: fileStream,
          })
        })
      })
      .andThen(() => {
        // Add the certificate file to the project

        const updatedProject = applyProjectUpdate({
          project,
          update: { certificateFileId: file.id.toString() },
          context: { type: 'certificate-generation', userId: '' },
        })

        if (!updatedProject) {
          return errAsync(
            new OtherError(
              'Impossible de mettre à jour le projet avec son certificat'
            )
          )
        }

        return fromOldResultAsync(this.saveProject(updatedProject)).mapErr(
          (e: Error) =>
            new OtherError(
              'Impossible de mettre à jour le projet avec son certificat: ' +
                e.message
            )
        )
      })
  }
}
