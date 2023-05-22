import { Readable } from 'stream';

export type RécupérerFichierPropositionTechniqueEtFinancièrePort = (args: {
  identifiantProjet: string;
  référence: string;
  format: string;
}) => Promise<Readable>;
