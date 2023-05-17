import { IdentifiantProjet } from '../../projet';

export type RenommerPropositionTechniqueEtFinancière = (args: {
  identifiantProjet: IdentifiantProjet;
  ancienneRéférence: string;
  nouvelleRéférence: string;
  formatAncienFichier: string;
}) => Promise<void>;
