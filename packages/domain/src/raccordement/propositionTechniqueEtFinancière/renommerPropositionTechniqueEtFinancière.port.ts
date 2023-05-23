
export type RenommerPropositionTechniqueEtFinancièrePort = (args: {
  identifiantProjet: string;
  ancienneRéférence: string;
  nouvelleRéférence: string;
  formatAncienFichier: string;
}) => Promise<void>;
