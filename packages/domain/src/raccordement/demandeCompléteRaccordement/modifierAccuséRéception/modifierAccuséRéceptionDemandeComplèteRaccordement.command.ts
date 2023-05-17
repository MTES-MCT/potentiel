import { Readable } from 'stream';
import { IdentifiantProjet } from '../../../projet';

export type RemplacerAccuséRéceptionDemandeComplèteRaccordement = (args: {
  identifiantProjet: IdentifiantProjet;
  ancienneRéférence: string;
  nouvelleRéférence: string;
  nouveauFichier: {
    format: string;
    content: Readable;
  };
}) => Promise<void>;
