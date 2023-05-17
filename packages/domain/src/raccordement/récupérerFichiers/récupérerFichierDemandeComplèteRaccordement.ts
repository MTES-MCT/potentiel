import { Readable } from 'stream';
import { TéléchargerFichierDemandeComplèteRaccordementQuery } from './téléchargerFichierDemandeComplèteRaccordement.query';

export type RécupérerFichierDemandeComplèteRaccordement = (
  args: TéléchargerFichierDemandeComplèteRaccordementQuery['data'] & { format: string },
) => Promise<Readable>;
