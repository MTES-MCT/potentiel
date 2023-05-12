import { Readable } from 'stream';

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordement = (
  path: string,
  content: Readable,
) => Promise<void>;
