import { errAsync, okAsync, wrapInfra } from '@core/utils';
import { EntityNotFoundError } from '@modules/shared';
import { résuméProjetQueryHandler } from './résuméProjetQueryHandler';
import { listerGestionnairesRéseau } from '../gestionnaireRéseau/listerGestionnaireRéseau';
import { RécupérerRésuméProjetEtListeGestionnairesQueryHandler } from '@modules/project';

export const récupérerRésuméProjetEtListeGestionnairesQueryHandler: RécupérerRésuméProjetEtListeGestionnairesQueryHandler =
  (projectId) => {
    return résuméProjetQueryHandler(projectId)
      .andThen((projet) => {
        if (!projet) {
          return errAsync(new EntityNotFoundError());
        }
        return okAsync(projet);
      })
      .andThen((projet) => {
        return wrapInfra(listerGestionnairesRéseau()).andThen((liste) => {
          return okAsync({ projet, listeDétailGestionnaires: liste });
        });
      });
  };
