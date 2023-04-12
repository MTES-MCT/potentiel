import { ReadModel } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../../../gestionnaireRéseau';

export type ListeDemandeComplèteRaccordementReadModel = ReadModel<
  'liste-demande-complète-raccordement',
  {
    gestionnaireRéseau: GestionnaireRéseauReadModel;
    référencesDemandeRaccordement: string[];
  }
>;
