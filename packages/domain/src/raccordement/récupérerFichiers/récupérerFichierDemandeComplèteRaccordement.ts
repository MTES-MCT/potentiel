import { Readable } from 'stream';
import { TéléchargerFichierDemandeComplèteRaccordementQuery } from './téléchargerFichierDemandeComplèteRaccordement.query';

export type RécupérerFichierDemandeComplèteRaccordement = (
  args: TéléchargerFichierDemandeComplèteRaccordementQuery & { format: string },
) => Promise<Readable>;
