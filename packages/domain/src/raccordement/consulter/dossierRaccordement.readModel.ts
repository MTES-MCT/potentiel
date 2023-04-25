import { ReadModel } from '@potentiel/core-domain';

export type DossierRaccordementReadModel = ReadModel<
  'dossier-raccordement',
  {
    référence: string;
    dateQualification?: string;
    propositionTechniqueEtFinancière?: {
      dateSignature: string;
    };
    dateMiseEnService?: string;
  }
>;
