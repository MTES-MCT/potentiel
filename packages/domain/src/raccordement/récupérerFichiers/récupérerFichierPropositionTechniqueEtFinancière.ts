import { Readable } from 'stream';
import { TéléchargerFichierPropositionTechniqueEtFinancièreQuery } from './téléchargerFichierPropositionTechniqueEtFinancière.query';

export type RécupérerFichierPropositionTechniqueEtFinancière = (
  args: TéléchargerFichierPropositionTechniqueEtFinancièreQuery['data'] & { format: string },
) => Promise<Readable>;
