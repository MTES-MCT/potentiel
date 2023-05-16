import { ReadModel } from '@potentiel/core-domain';
import { Readable } from 'stream';

export type TéléchargerFichierDemandeComplèteRaccordementReadModel = ReadModel<
  'fichier-demande-complète-raccordement',
  { format: string; content: Readable }
>;
