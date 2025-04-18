export type ModèleRéponse = {
  data: {
    suiviPar: string; // user qui édite le document
    suiviParEmail: string; // email dgec var env
    dreal: string; // région projet
    refPotentiel: string; // identifiantProjet
    nomRepresentantLegal: string;
    nomCandidat: string;
    adresseCandidat: string;
    email: string;
    titrePeriode: string;
    titreAppelOffre: string;
    familles: 'yes' | '';
    titreFamille: string;
    nomProjet: string;
    puissance: string;
    codePostalProjet: string;
    communeProjet: string;
    unitePuissance: string;
    dateNotification: string;
  };
};
