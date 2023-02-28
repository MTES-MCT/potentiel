import { EventStore, Repository, UniqueEntityID } from '@core/domain';
import { errAsync, okAsync, ResultAsync, wrapInfra } from '@core/utils';
import { User } from '@entities';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import { Project } from '../Project';
import { TrouverProjetsParIdentifiantGestionnaireRéseau } from '../queries';
import {
  IdentifiantGestionnaireRéseauExistantError,
  IdentifiantGestionnaireRéseauObligatoireError,
} from '../errors';
import { NumeroGestionnaireSubmitted } from '../events';
import { GestionnaireRéseauDéjàExistantError } from '@modules/gestionnaireRéseau/ajouter/gestionnaireRéseauDéjàExistant.error';

type Command = {
  projetId: string;
  utilisateur: User;
  identifiantGestionnaireRéseau: string;
  codeEICGestionnaireRéseau?: string;
};

type Dependancies = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  publishToEventStore: EventStore['publish'];
  projectRepo: Repository<Project>;
  trouverProjetsParIdentifiantGestionnaireRéseau: TrouverProjetsParIdentifiantGestionnaireRéseau;
};

type CommandHandler = (
  command: Command,
) => ResultAsync<
  null,
  InfraNotAvailableError | UnauthorizedError | GestionnaireRéseauDéjàExistantError
>;

export const renseignerIdentifiantGestionnaireRéseauFactory = ({
  shouldUserAccessProject,
  publishToEventStore,
  projectRepo,
  trouverProjetsParIdentifiantGestionnaireRéseau,
}: Dependancies): CommandHandler => {
  const chargerProjet = (commande: { projetId: string; utilisateur: User }) => {
    const { projetId, utilisateur } = commande;
    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: utilisateur })).andThen(
      (utilisateurALesDroits) =>
        utilisateurALesDroits
          ? projectRepo.load(new UniqueEntityID(projetId)).map((projet) => ({
              commande,
              projet,
            }))
          : errAsync(new UnauthorizedError()),
    );
  };

  const vérifierIdentifiantGestionnaireRéseau = ({
    commande,
    projet,
  }: {
    commande: Command;
    projet: Project;
  }) => {
    if (!commande.identifiantGestionnaireRéseau) {
      return errAsync(new IdentifiantGestionnaireRéseauObligatoireError());
    }

    return trouverProjetsParIdentifiantGestionnaireRéseau(
      commande.identifiantGestionnaireRéseau,
    ).andThen((projets) => {
      const existePourUnAutreProjet = projets.filter((p) => p !== commande.projetId).length > 0;

      return existePourUnAutreProjet
        ? errAsync(new IdentifiantGestionnaireRéseauExistantError())
        : okAsync({ commande, projet });
    });
  };

  const enregistrerLeChoix = ({
    projet,
    commande: { projetId, utilisateur, identifiantGestionnaireRéseau },
  }: {
    commande: Command;
    projet: Project;
  }) =>
    projet.identifiantGestionnaireRéseau !== identifiantGestionnaireRéseau
      ? publishToEventStore(
          new NumeroGestionnaireSubmitted({
            payload: {
              projectId: projetId,
              submittedBy: utilisateur.id,
              numeroGestionnaire: identifiantGestionnaireRéseau,
            },
          }),
        )
      : okAsync(null);

  return (commande) =>
    chargerProjet(commande)
      .andThen(vérifierIdentifiantGestionnaireRéseau)
      .andThen(enregistrerLeChoix);
};
