import { ReadModel } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../../gestionnaireRéseau';

export type ListeDossiersRaccordementReadModel = ReadModel<
  'liste-dossiers-raccordement',
  {
    gestionnaireRéseau: GestionnaireRéseauReadModel;
    références: string[];
  }
>;
