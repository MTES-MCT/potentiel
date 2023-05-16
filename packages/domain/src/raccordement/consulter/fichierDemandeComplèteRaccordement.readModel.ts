import { ReadModel } from '@potentiel/core-domain';
import { Readable } from 'stream';

export type TéléchargerFichierDemandeComplèteRaccordementReadModel = ReadModel<
  'fichier-demander-complète-raccordement',
  { format: string; content: Readable }
>;
