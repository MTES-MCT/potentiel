import { Readable } from 'stream';

export type EnregistrerPropositionTechniqueEtFinancièreSignéePort = (args: {
  identifiantProjet: string;
  référence: string;
  format: string;
  content: Readable;
}) => Promise<void>;
