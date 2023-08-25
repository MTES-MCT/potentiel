//TO DO : après rebase de la branche garanties-financieres, utiliser ce type pour la page projet aussi
export type ProjectGarantiesFinancièresData = {
  actionRequise?: 'compléter enregistrement' | 'enregistrer' | 'déposer' | 'compléter dépôt';
  actuelles?: {
    typeGarantiesFinancières?: "avec date d'échéance" | 'consignation' | '6 mois après achèvement';
    dateÉchéance?: string;
    attestationConstitution?: { format: string; date: string };
  };
  dépôt?: {
    typeGarantiesFinancières?: "avec date d'échéance" | 'consignation' | '6 mois après achèvement';
    dateÉchéance?: string;
    attestationConstitution: { format: string; date: string };
  };
};

export type GarantiesFinancièresListItem = {
  id: string;
  nomProjet: string;
  potentielIdentifier: string;
  numeroCRE: string;
  communeProjet: string;
  departementProjet: string;
  regionProjet: string;
  nomCandidat: string;
  nomRepresentantLegal: string;
  notifiedOn: number;
  email: string;
  appelOffre: {
    title: string;
    periode: string;
    famille: string;
  };
  garantiesFinancières?: ProjectGarantiesFinancièresData;
};
