import { Repository, UniqueEntityID } from '@core/domain';
import { errAsync, okAsync, ResultAsync, wrapInfra } from '@core/utils';
import { User } from '@entities';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import { Project } from '../Project';
import { TrouverProjetsParIdentifiantGestionnaireRéseau } from '../queries';
import {
  CodeEICNonTrouvéError,
  IdentifiantGestionnaireRéseauExistantError,
  IdentifiantGestionnaireRéseauObligatoireError,
} from '../errors';
import { NumeroGestionnaireSubmitted } from '../events';
import { Publish } from '../../../core/domain/publish';

type Command = {
  projetId: string;
  utilisateur: User;
  identifiantGestionnaireRéseau: string;
};

type Dependencies = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  publish: Publish;
  projectRepo: Repository<Project>;
  trouverProjetsParIdentifiantGestionnaireRéseau: TrouverProjetsParIdentifiantGestionnaireRéseau;
};

type CommandHandler = (
  command: Command,
) => ResultAsync<
  null,
  | InfraNotAvailableError
  | UnauthorizedError
  | CodeEICNonTrouvéError
  | IdentifiantGestionnaireRéseauObligatoireError
  | IdentifiantGestionnaireRéseauExistantError
>;

export const renseignerIdentifiantGestionnaireRéseauFactory = ({
  shouldUserAccessProject,
  publish,
  projectRepo,
  trouverProjetsParIdentifiantGestionnaireRéseau,
}: Dependencies): CommandHandler => {
  const chargerProjet = (command: { projetId: string; utilisateur: User }) => {
    const { projetId, utilisateur } = command;
    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: utilisateur })).andThen(
      (utilisateurALesDroits) =>
        utilisateurALesDroits
          ? projectRepo.load(new UniqueEntityID(projetId)).map((projet) => ({
              command,
              projet,
            }))
          : errAsync(new UnauthorizedError()),
    );
  };

  const vérifierIdentifiantGestionnaireRéseau = ({
    command,
    projet,
  }: {
    command: Command;
    projet: Project;
  }) => {
    if (!command.identifiantGestionnaireRéseau) {
      return errAsync(new IdentifiantGestionnaireRéseauObligatoireError());
    }

    return trouverProjetsParIdentifiantGestionnaireRéseau(
      command.identifiantGestionnaireRéseau,
    ).andThen((projets) => {
      const existePourUnAutreProjet = projets.filter((p) => p !== command.projetId).length > 0;

      return existePourUnAutreProjet
        ? errAsync(new IdentifiantGestionnaireRéseauExistantError())
        : okAsync({ command, projet });
    });
  };

  const enregistrerLeChoix = ({
    projet,
    command: { projetId, utilisateur, identifiantGestionnaireRéseau },
  }: {
    command: Command;
    projet: Project;
  }) => {
    if (projet.identifiantGestionnaireRéseau !== identifiantGestionnaireRéseau) {
      return publish(
        new NumeroGestionnaireSubmitted({
          payload: {
            projectId: projetId,
            submittedBy: utilisateur.id,
            numeroGestionnaire: identifiantGestionnaireRéseau,
          },
        }),
      );
    }

    return okAsync(null);
  };
  return (command) =>
    chargerProjet(command)
      .andThen(vérifierIdentifiantGestionnaireRéseau)
      .andThen(enregistrerLeChoix);
};
