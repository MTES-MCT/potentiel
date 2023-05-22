import { Readable } from 'stream';

export type EnregistrerFichierPropositionTechniqueEtFinancièrePort = (args: {
  identifiantProjet: string;
  référence: string;
  format: string;
  content: Readable;
}) => Promise<void>;
