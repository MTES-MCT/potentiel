import { Readable } from 'stream';
import { IdentifiantProjet } from '../../projet';

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordement = (args: {
  identifiantProjet: IdentifiantProjet;
  référenceDossierRaccordement: string;
  format: string;
  content: Readable;
}) => Promise<void>;
