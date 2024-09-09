import { Repository, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { err, errAsync, logger, ok, okAsync, Result, ResultAsync } from '../../../core/utils';
import { User } from '../../../entities';
import { ProjetDéjàClasséError } from '../../modificationRequest';
import { FileContents, FileObject, IllegalFileDataError, makeFileObject } from '../../file';
import {
  EntityNotFoundError,
  InfraNotAvailableError,
  OtherError,
  UnauthorizedError,
} from '../../shared';
import {
  CertificateFileIsMissingError,
  IllegalProjectDataError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
} from '../errors';
import { ProjectHasBeenUpdatedSinceError } from '../errors/ProjectHasBeenUpdatedSinceError';
import { Project } from '../Project';
import { Actionnariat } from '../types';

interface CorrectProjectDataDeps {
  projectRepo: TransactionalRepository<Project>;
  fileRepo: Repository<FileObject>;
}

interface CorrectProjectDataArgs {
  projectId: string;
  certificateFile?: {
    contents: FileContents;
    filename: string;
  };
  projectVersionDate: Date;
  newNotifiedOn: number;
  user: User;
  shouldGrantClasse: boolean;
  attestation: 'regenerate' | 'donotregenerate' | 'custom';
  reason?: string;
  correctedData: Partial<{
    nomProjet: string;
    territoireProjet: string;
    puissance: number;
    prixReference: number;
    evaluationCarbone: number;
    note: number;
    nomCandidat: string;
    nomRepresentantLegal: string;
    email: string;
    adresseProjet: string;
    codePostalProjet: string;
    communeProjet: string;
    engagementFournitureDePuissanceAlaPointe: boolean;
    isFinancementParticipatif: boolean;
    isInvestissementParticipatif: boolean;
    motifsElimination: string;
    actionnariat?: Actionnariat;
  }>;
}

type CorrectProjectDataError =
  | InfraNotAvailableError
  | EntityNotFoundError
  | ProjectHasBeenUpdatedSinceError
  | UnauthorizedError
  | ProjectCannotBeUpdatedIfUnnotifiedError
  | IllegalProjectDataError
  | IllegalFileDataError
  | OtherError
  | ProjetDéjàClasséError;

export type CorrectProjectData = (
  args: CorrectProjectDataArgs,
) => ResultAsync<null, CorrectProjectDataError>;

export const makeCorrectProjectData =
  (deps: CorrectProjectDataDeps): CorrectProjectData =>
  ({
    projectId,
    // TODO remove

    certificateFile,
    projectVersionDate,
    newNotifiedOn,
    user,
    correctedData,
    shouldGrantClasse,
    // TODO remove
    reason,
    // TODO remove
    attestation,
  }) => {
    if (!['admin', 'dgec-validateur'].includes(user.role)) {
      return errAsync(new UnauthorizedError());
    }

    return deps.projectRepo.transaction(
      new UniqueEntityID(projectId),
      (
        project: Project,
      ): Result<
        null,
        | ProjectHasBeenUpdatedSinceError
        | ProjectCannotBeUpdatedIfUnnotifiedError
        | IllegalProjectDataError
      > => {
        if (project.lastUpdatedOn && project.lastUpdatedOn > projectVersionDate) {
          return err(new ProjectHasBeenUpdatedSinceError());
        }

        if (newNotifiedOn && project.isLegacy) {
          return err(new UnauthorizedError());
        }

        return _grantClasseIfNecessary(project)
          .andThen(() => project.correctData(user, correctedData))
          .andThen(() =>
            newNotifiedOn
              ? project.setNotificationDate(user, newNotifiedOn)
              : ok<null, never>(null),
          );
      },
    );

    function _grantClasseIfNecessary(project: Project): Result<null, ProjetDéjàClasséError> {
      return shouldGrantClasse ? project.grantClasse(user) : ok(null);
    }
  };
