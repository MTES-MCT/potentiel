import { ReadModel } from '@potentiel/core-domain';
import { Readable } from 'stream';

export type PropositionTechniqueEtFinancièreSignéeReadModel = ReadModel<
  'proposition-technique-et-financière-signée',
  { format: string; content: Readable }
>;
