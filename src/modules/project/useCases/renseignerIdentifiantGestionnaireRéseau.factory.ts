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
import { GestionnaireRéseauRenseigné, NumeroGestionnaireSubmitted } from '../events';
//import { GestionnaireRéseau } from '@modules/gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { Publish } from '../../../core/domain/publish';

type Command = {
  projetId: string;
  utilisateur: User;
  identifiantGestionnaireRéseau: string;
  codeEICGestionnaireRéseau?: string;
};

type Dependencies = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  publish: Publish;
  projectRepo: Repository<Project>;
  trouverProjetsParIdentifiantGestionnaireRéseau: TrouverProjetsParIdentifiantGestionnaireRéseau;
  //gestionnaireRéseauRepo: Repository<GestionnaireRéseau>;
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
}: //gestionnaireRéseauRepo,
Dependencies): CommandHandler => {
  const vérifierCodeEIC = (command: Command) => {
    // if (command.codeEICGestionnaireRéseau) {
    //   return gestionnaireRéseauRepo
    //     .load(new UniqueEntityID(command.codeEICGestionnaireRéseau))
    //     .andThen((gestionnaire) => {
    //       if (gestionnaire.codeEIC !== command.codeEICGestionnaireRéseau) {
    //         return errAsync(new CodeEICNonTrouvéError());
    //       }
    //       return okAsync(command);
    //     });
    // }
    return okAsync(command);
  };

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
    command: { projetId, utilisateur, identifiantGestionnaireRéseau, codeEICGestionnaireRéseau },
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
            ...(codeEICGestionnaireRéseau && { codeEICGestionnaireRéseau }),
          },
        }),
      );
    }

    if (codeEICGestionnaireRéseau) {
      return publish(
        new GestionnaireRéseauRenseigné({
          payload: {
            projectId: projetId,
            submittedBy: utilisateur.id,
            codeEIC: codeEICGestionnaireRéseau,
          },
        }),
      );
    }

    return okAsync(null);
  };
  return (command) =>
    vérifierCodeEIC(command)
      .andThen(chargerProjet)
      .andThen(vérifierIdentifiantGestionnaireRéseau)
      .andThen(enregistrerLeChoix);
};
