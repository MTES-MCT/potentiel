import {
  EventStore,
  Repository,
  TransactionalRepository,
  UniqueEntityID,
} from '../../../../core/domain';
import { errAsync, wrapInfra } from '../../../../core/utils';
import { User } from '../../../../entities';
import { FileContents, FileObject, makeAndSaveFile } from '../../../file';
import { Project } from '../../../project';
import { UnauthorizedError } from '../../../shared';
import { DemandeDélai } from '../DemandeDélai';
import { DélaiAccordéCorrigé } from '../events';
import { CorrectionDélaiImpossibleCarProjetNonClasséError } from './CorrectionDélaiImpossibleCarProjetNonClasséError';
import { CorrectionDélaiNonAccordéImpossibleError } from './CorrectionDélaiNonAccordéImpossibleError';
import { DateAntérieureDateAchèvementInitialeError } from './DateAntérieureDateAchèvementInitialeError';

type Dependencies = {
  publishToEventStore: EventStore['publish'];
  demandeDélaiRepo: Repository<DemandeDélai> & TransactionalRepository<DemandeDélai>;
  projectRepo: Repository<Project>;
  fileRepo: Repository<FileObject>;
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
};

type Args = {
  demandeDélaiId: string;
  fichierRéponse: { contents: FileContents; filename: string };
  user: User;
  dateAchèvementAccordée: Date;
  dateAchèvementProjetInitiale: Date;
  explications?: string;
  projectLegacyId: string;
};

export const makeCorrigerDélaiAccordé =
  ({
    publishToEventStore: publishToEventStore,
    demandeDélaiRepo,
    fileRepo,
    shouldUserAccessProject,
    projectRepo,
  }: Dependencies) =>
  ({
    demandeDélaiId,
    fichierRéponse,
    explications,
    user,
    dateAchèvementAccordée,
    dateAchèvementProjetInitiale,
    projectLegacyId,
  }: Args) => {
    return wrapInfra(shouldUserAccessProject({ projectId: projectLegacyId, user })).andThen(
      (userHasRightsToProject) => {
        if (!userHasRightsToProject) return errAsync(new UnauthorizedError());
        return projectRepo
          .load(new UniqueEntityID(projectLegacyId))
          .map((project) => ({ project }))
          .andThen(({ project }) => {
            const {
              completionDueOn,
              isClasse,
              abandonedOn,
              appelOffreId,
              periodeId,
              familleId,
              data,
            } = project;
            if (!isClasse || abandonedOn > 0) {
              return errAsync(new CorrectionDélaiImpossibleCarProjetNonClasséError());
            }
            if (dateAchèvementAccordée.getTime() < dateAchèvementProjetInitiale.getTime()) {
              return errAsync(new DateAntérieureDateAchèvementInitialeError());
            }

            return demandeDélaiRepo.transaction(
              new UniqueEntityID(demandeDélaiId),
              (demandeDélai) => {
                const { statut } = demandeDélai;

                if (statut !== 'accordée') {
                  return errAsync(new CorrectionDélaiNonAccordéImpossibleError());
                }

                return makeAndSaveFile({
                  file: {
                    designation: 'modification-request-response',
                    forProject: new UniqueEntityID(demandeDélai.projetId),
                    createdBy: new UniqueEntityID(user.id),
                    filename: fichierRéponse.filename,
                    contents: fichierRéponse.contents,
                  },
                  fileRepo,
                }).andThen((fichierRéponseId) => {
                  return publishToEventStore(
                    new DélaiAccordéCorrigé({
                      payload: {
                        corrigéPar: user.id,
                        projectLegacyId,
                        identifiantProjet: `${appelOffreId}#${periodeId}#${familleId || ''}#${
                          data!.numeroCRE
                        }`,
                        dateAchèvementAccordée: dateAchèvementAccordée.toISOString(),
                        demandeDélaiId,
                        fichierRéponseId,
                        explications,
                        ancienneDateThéoriqueAchèvement: new Date(completionDueOn).toISOString(),
                      },
                    }),
                  );
                });
              },
            );
          });
      },
    );
  };
