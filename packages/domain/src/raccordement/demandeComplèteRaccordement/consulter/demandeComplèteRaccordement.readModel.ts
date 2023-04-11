import { ReadModel } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../../../gestionnaireRéseau';

export type DemandeComplèteRaccordementReadModel = ReadModel<
  'demande-complète-raccordement',
  {
    référenceDemandeRaccordement: string;
    gestionnaireRéseau: GestionnaireRéseauReadModel;
    dateQualification: string;
    propositionTechniqueEtFinancière?: {
      dateSignature: string;
    };
  }
>;
