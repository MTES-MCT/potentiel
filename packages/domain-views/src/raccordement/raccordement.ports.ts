import { Readable } from 'stream';

export type RécupérerPropositionTechniqueEtFinancièreSignéePort = (args: {
  type: 'proposition-technique-et-financiere';
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  format: string;
}) => Promise<Readable | undefined>;

export type RécupérerAccuséRéceptionDemandeComplèteRaccordementPort = (args: {
  type: 'demande-complete-raccordement';
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  format: string;
}) => Promise<Readable | undefined>;
