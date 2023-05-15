import { ReadModel } from '@potentiel/core-domain';

export type DossierRaccordementReadModel = ReadModel<
  'dossier-raccordement',
  {
    référence: string;
    dateQualification?: string;
    propositionTechniqueEtFinancière?: {
      dateSignature: string;
      format?: string;
    };
    dateMiseEnService?: string;
    accuséRéception?: { format: string };
  }
>;
