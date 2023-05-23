import { ReadModel } from '@potentiel/core-domain';
import { Readable } from 'stream';

export type AccuséRéceptionDemandeComplèteRaccordementReadModel = ReadModel<
  'accusé-réception-demande-compléte-raccordement',
  { format: string; content: Readable }
>;
