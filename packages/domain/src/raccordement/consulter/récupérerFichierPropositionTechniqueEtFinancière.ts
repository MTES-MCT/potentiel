import { Readable } from 'stream';
import { TéléchargerFichierPropositionTechniqueEtFinancièreQuery } from './téléchargerFichierPropositionTechniqueEtFinancière.query';

export type RécupérerFichierPropositionTechniqueEtFinancière = (
  args: TéléchargerFichierPropositionTechniqueEtFinancièreQuery,
) => Promise<Readable>;
