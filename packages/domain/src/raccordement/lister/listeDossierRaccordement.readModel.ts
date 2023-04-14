import { ReadModel } from '@potentiel/core-domain';

export type ListeDossiersRaccordementReadModel = ReadModel<
  'liste-dossiers-raccordement',
  {
    dossiers: Array<{
      codeEIC: string;
      référence: string;
    }>;
  }
>;
