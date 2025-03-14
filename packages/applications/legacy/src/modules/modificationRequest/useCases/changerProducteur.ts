import {
  EventBus,
  Repository,
  TransactionalRepository,
  UniqueEntityID,
} from '../../../core/domain';
import { errAsync, okAsync, ResultAsync, wrapInfra } from '../../../core/utils';
import { User, formatCahierDesChargesRéférence } from '../../../entities';
import { FileContents, FileObject, makeFileObject } from '../../file';
import { Project } from '../../project/Project';
import { UnauthorizedError } from '../../shared';
import { ModificationReceived } from '../events';
import { AppelOffreRepo } from '../../../dataAccess';
import { NouveauCahierDesChargesNonChoisiError } from '../../demandeModification';
import { RetirerAccèsProjetUseCase } from '@potentiel-domain/utilisateur';
import { mediator } from 'mediateur';
import { DateTime } from '@potentiel-domain/common';

type ChangerProducteurDeps = {
  eventBus: EventBus;
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  projectRepo: TransactionalRepository<Project>;
  fileRepo: Repository<FileObject>;
  findAppelOffreById: AppelOffreRepo['findById'];
};

type ChangerProducteurArgs = {
  projetId: string;
  porteur: User;
  nouveauProducteur: string;
  justification?: string;
  fichier?: { contents: FileContents; filename: string };
};

export const makeChangerProducteur =
  ({
    eventBus,
    shouldUserAccessProject,
    projectRepo,
    fileRepo,
    findAppelOffreById,
  }: ChangerProducteurDeps) =>
  ({ projetId, porteur, nouveauProducteur, justification, fichier }: ChangerProducteurArgs) => {
    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: porteur })).andThen(
      (utilisateurALesDroits) => {
        if (!utilisateurALesDroits) return errAsync(new UnauthorizedError());
        return projectRepo.transaction(new UniqueEntityID(projetId), (projet) => {
          return wrapInfra(findAppelOffreById(projet.appelOffreId))
            .andThen((appelOffre) => {
              if (
                projet.cahierDesCharges.type === 'initial' &&
                appelOffre?.periodes.find(({ id }) => id === projet.periodeId)
                  ?.choisirNouveauCahierDesCharges
              ) {
                return errAsync(new NouveauCahierDesChargesNonChoisiError());
              }

              if (fichier) {
                return makeFileObject({
                  designation: 'modification-request',
                  forProject: new UniqueEntityID(projetId),
                  createdBy: new UniqueEntityID(porteur.id),
                  filename: fichier.filename,
                  contents: fichier.contents,
                }).asyncAndThen((file) => fileRepo.save(file).map(() => file.id.toString()));
              }

              return okAsync(null);
            })
            .andThen((fileId) => {
              return projet
                .updateProducteur(porteur, nouveauProducteur)
                .asyncMap(async () => fileId);
            })
            .andThen((fileId) => {
              return eventBus.publish(
                new ModificationReceived({
                  payload: {
                    modificationRequestId: new UniqueEntityID().toString(),
                    projectId: projetId,
                    requestedBy: porteur.id,
                    type: 'producteur',
                    producteur: nouveauProducteur,
                    justification,
                    ...(fileId && { fileId }),
                    authority: 'dreal',
                    cahierDesCharges:
                      projet.cahierDesCharges.type === 'modifié'
                        ? formatCahierDesChargesRéférence(projet.cahierDesCharges)
                        : 'initial',
                  },
                }),
              );
            })
            .andThen(() => {
              return ResultAsync.fromPromise(
                mediator.send<RetirerAccèsProjetUseCase>({
                  type: 'Utilisateur.UseCase.RetirerAccèsProjet',
                  data: {
                    identifiantProjet: projet.identifiantProjet,
                    identifiantUtilisateur: porteur.email,
                    retiréLe: DateTime.now().formatter(),
                    retiréPar: porteur.email,
                    cause: 'changement-producteur',
                  },
                }),
                (e) => {
                  return new Error('Erreur lors de la révocation des accès au projet', {
                    cause: e,
                  });
                },
              );
            });
        });
      },
    );
  };
