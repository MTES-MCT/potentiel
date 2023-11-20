export type Candidature = {
  statut: 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';
  nom: string;
  appelOffre: string;
  période: string;
  famille: string;
  localité: {
    commune: string;
    département: string;
    région: string;
    codePostal: string;
  };
  dateDésignation: string;
};
