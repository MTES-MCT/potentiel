import { ReadModel } from '@potentiel/core-domain';
import { Readable } from 'stream';

export type TéléchargerFichierPropositionTechniqueEtFinancièreReadModel = ReadModel<
  'fichier-proposition-technique-et-financiere',
  { format: string; content: Readable }
>;
