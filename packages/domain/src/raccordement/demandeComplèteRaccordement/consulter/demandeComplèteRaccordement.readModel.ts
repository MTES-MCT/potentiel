import { ReadModel } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '@potentiel/domain';

export type DemandeComplèteRaccordementReadModel = ReadModel<
  'demande-complète-raccordement',
  {
    référenceDemandeRaccordement: string;
    gestionnaireRéseau: GestionnaireRéseauReadModel;
    dateQualification: string;
  }
>;
