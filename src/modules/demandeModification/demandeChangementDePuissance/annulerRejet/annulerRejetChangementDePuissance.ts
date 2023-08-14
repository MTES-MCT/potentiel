import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../../core/domain';
import { errAsync, ResultAsync, wrapInfra } from '../../../../core/utils';
import { User } from '../../../../entities';
import { StatutRéponseIncompatibleAvecAnnulationError } from "../../errors";
import {
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from "../../../shared";
import { ModificationRequest } from "../../../modificationRequest";
import { RejetChangementDePuissanceAnnulé } from '../events';

type AnnulerRejetChangementDePuissance = (commande: {
  user: User;
  demandeChangementDePuissanceId: string;
}) => ResultAsync<
  null,
  | InfraNotAvailableError
  | UnauthorizedError
  | StatutRéponseIncompatibleAvecAnnulationError
  | EntityNotFoundError
>;

type MakeAnnulerRejetChangementDePuissance = (dépendances: {
  modificationRequestRepo: TransactionalRepository<ModificationRequest>;
  publishToEventStore: EventStore['publish'];
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
}) => AnnulerRejetChangementDePuissance;

export const makeAnnulerRejetChangementDePuissance: MakeAnnulerRejetChangementDePuissance =
  ({ publishToEventStore, modificationRequestRepo, shouldUserAccessProject }) =>
  ({ user, demandeChangementDePuissanceId }) => {
    if (!['admin', 'dgec-validateur', 'dreal'].includes(user.role)) {
      return errAsync(new UnauthorizedError());
    }

    return modificationRequestRepo.transaction(
      new UniqueEntityID(demandeChangementDePuissanceId),
      (demandeChangementDePuissance) => {
        const { status, projectId } = demandeChangementDePuissance;
        if (!projectId) {
          return errAsync(new InfraNotAvailableError());
        }

        return wrapInfra(
          shouldUserAccessProject({ projectId: projectId.toString(), user }),
        ).andThen((utilisateurALesDroits) => {
          if (!utilisateurALesDroits) {
            return errAsync(new UnauthorizedError());
          }

          if (status !== 'rejetée') {
            return errAsync(new StatutRéponseIncompatibleAvecAnnulationError(status || 'inconnu'));
          }

          return publishToEventStore(
            new RejetChangementDePuissanceAnnulé({
              payload: {
                demandeChangementDePuissanceId,
                projetId: projectId.toString(),
                annuléPar: user.id,
              },
            }),
          );
        });
      },
    );
  };
