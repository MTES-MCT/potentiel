import { errAsync, okAsync, wrapInfra } from '@core/utils';
import { EntityNotFoundError } from '@modules/shared';
import { ModifierGestionnaireRéseauQueryHandler } from '@modules/project/queries/ModifierGestionnaireRéseau';
import { résuméProjetQueryHandler } from './résuméProjetQueryHandler';
import { listerDétailGestionnairesRéseauQueryHandler } from '../gestionnaireRéseau/listerDétailGestionnairesRéseau';

export const modifierGestionnaireRéseauQueryHandler: ModifierGestionnaireRéseauQueryHandler = (
  projectId,
) => {
  return résuméProjetQueryHandler(projectId)
    .andThen((projet) => {
      if (!projet) {
        return errAsync(new EntityNotFoundError());
      }
      return okAsync(projet);
    })
    .andThen((projet) => {
      return wrapInfra(listerDétailGestionnairesRéseauQueryHandler()).andThen((liste) => {
        return okAsync({ projet, listeDétailGestionnaires: liste });
      });
    });
};
