import { IdentifiantProjet } from '../../projet';

export type RenommerPropositionTechniqueEtFinancière = (args: {
  identifiantProjet: IdentifiantProjet;
  ancienneRéférence: string;
  nouvelleRéférence: string;
  ancienFichier: { format: string };
}) => Promise<void>;
