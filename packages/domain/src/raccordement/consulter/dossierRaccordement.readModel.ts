import { ReadModel } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../../gestionnaireRéseau';

export type DossierRaccordementReadModel = ReadModel<
  'dossier-raccordement',
  {
    référence: string;
    gestionnaireRéseau: GestionnaireRéseauReadModel;
    dateQualification: string;
    propositionTechniqueEtFinancière?: {
      dateSignature: string;
    };
  }
>;
