import { Repository, UniqueEntityID } from '../../../core/domain';
import { ResultAsync, errAsync, okAsync, wrapInfra } from '../../../core/utils';
import { FileObject, makeFileObject } from '../../file';
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  IncompleteDataError,
  InfraNotAvailableError,
  OtherError,
} from '../../shared/errors';
import { IllegalProjectDataError, ProjectNotEligibleForCertificateError } from '../errors';
import { Project } from '../Project';
import { GetUserById } from '../../../infra/sequelize/queries/users';
import { ProjectDataForCertificate } from '..';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { AppelOffreRepo } from '../../../dataAccess/inMemory';

export type GenerateCertificate = (args: {
  projectId: string;
  reason?: string;
  validateurId?: string;
}) => ResultAsync<
  null,
  | EntityNotFoundError
  | InfraNotAvailableError
  | IncompleteDataError
  | ProjectNotEligibleForCertificateError
  | OtherError
  | AggregateHasBeenUpdatedSinceError
>;

/* global NodeJS */
interface GenerateCertificateDeps {
  fileRepo: Repository<FileObject>;
  projectRepo: Repository<Project>;
  getUserById: GetUserById;
  findAppelOffreById: AppelOffreRepo['findById'];
  buildCertificate: (options: {
    template: AppelOffre.CertificateTemplate;
    data: ProjectDataForCertificate;
    validateur?: AppelOffre.Validateur;
  }) => ResultAsync<
    NodeJS.ReadableStream,
    | IllegalProjectDataError
    | OtherError
    | EntityNotFoundError
    | IncompleteDataError
    | AggregateHasBeenUpdatedSinceError
    | ProjectNotEligibleForCertificateError
    | InfraNotAvailableError
  >;
}
export const makeGenerateCertificate =
  ({
    getUserById,
    projectRepo,
    findAppelOffreById,
    buildCertificate,
    fileRepo,
  }: GenerateCertificateDeps): GenerateCertificate =>
  ({ projectId, reason, validateurId = null }) => {
    return projectRepo
      .load(new UniqueEntityID(projectId))
      .andThen(_getValidateur)
      .andThen(_buildCertificateForProject)
      .andThen(_saveCertificateToStorage)
      .andThen(_addCertificateFileIdToProject)
      .andThen((project) => projectRepo.save(project));

    function _getValidateur(project: Project) {
      return getUserById(validateurId)
        .andThen((validateur) => {
          if (validateur) {
            return okAsync({
              fullName: validateur.fullName,
              fonction: validateur.fonction,
            } satisfies AppelOffre.Validateur);
          }

          return wrapInfra(findAppelOffreById(project.appelOffreId)).andThen((appelOffre) => {
            if (!appelOffre) {
              return errAsync(new EntityNotFoundError());
            }

            const période = appelOffre.periodes.find((p) => p.id === project.periodeId);

            if (!période || période.type === 'legacy') {
              return errAsync(new EntityNotFoundError());
            }

            const validateurParDéfaut = période.validateurParDéfaut;

            return okAsync(validateurParDéfaut);
          });
        })
        .map((validateur) => ({
          validateur,
          project,
        }));
    }

    function _buildCertificateForProject({
      project,
      validateur,
    }: {
      project: Project;
      validateur: AppelOffre.Validateur;
    }) {
      return project.certificateData
        .asyncAndThen((certificateData) =>
          buildCertificate({
            ...certificateData,
            validateur,
          }),
        )
        .map((fileStream) => ({ fileStream, project }));
    }

    function _saveCertificateToStorage(args: {
      fileStream: NodeJS.ReadableStream;
      project: Project;
    }) {
      const { fileStream, project } = args;
      return makeFileObject({
        filename: project.certificateFilename,
        contents: fileStream,
        forProject: new UniqueEntityID(projectId),
        designation: 'attestation-designation',
      })
        .mapErr((e) => new OtherError(e.message))
        .asyncAndThen((file: FileObject) => {
          return fileRepo.save(file).map(() => file.id.toString());
        })
        .map((certificateFileId) => ({ certificateFileId, project }));
    }

    function _addCertificateFileIdToProject(args: { certificateFileId: string; project: Project }) {
      const { certificateFileId, project } = args;
      return project
        .addGeneratedCertificate({
          projectVersionDate: project.lastUpdatedOn || new Date(),
          certificateFileId,
          reason,
        })
        .map(() => project);
    }
  };
