import { ReadModel } from '@potentiel/core-domain';

export type ListeDossiersRaccordementReadModel = ReadModel<
  'liste-dossiers-raccordement',
  {
    références: string[];
  }
>;
