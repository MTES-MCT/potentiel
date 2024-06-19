type ModèleRéponseAbandon = {
  type: 'abandon';
  data: {
    aprèsConfirmation: boolean;

    suiviPar: string; // user qui édite le document
    suiviParEmail: string; // email dgec var env
    refPotentiel: string; // identifiantProjet

    dreal: string; // région projet

    status: string;

    nomRepresentantLegal: string;
    nomCandidat: string;
    adresseCandidat: string;
    email: string;

    titrePeriode: string;
    titreAppelOffre: string;
    familles: 'yes' | '';
    titreFamille: string;
    dateNotification: string;

    nomProjet: string;
    codePostalProjet: string;
    communeProjet: string;
    puissance: string;
    unitePuissance: string;

    dateDemande: string;
    justificationDemande: string;

    referenceParagrapheAbandon: string;
    contenuParagrapheAbandon: string;

    dateDemandeConfirmation: string;
    dateConfirmation: string;

    isEDFOA: string;
    isEDFSEI: string;
    isEDM: string;
  };
};

type ModèleMiseEnDemeure = {
  type: 'mise-en-demeure';
  data: {
    dreal: string;
    dateMiseEnDemeure: string;
    contactDreal: string;
    referenceProjet: string;
    titreAppelOffre: string;
    dateLancementAppelOffre: string;
    nomProjet: string;
    adresseCompleteProjet: string;
    puissanceProjet: string;
    unitePuissance: string;
    titrePeriode: string;
    dateNotification: string;
    paragrapheGF: string;
    garantieFinanciereEnMois: string;
    dateFinGarantieFinanciere: string;
    dateLimiteDepotGF: string;
    nomRepresentantLegal: string;
    adresseProjet: string;
    codePostalProjet: string;
    communeProjet: string;
    emailProjet: string;
  };
};

type LogoDreal =
  | 'Auvergne-Rhône-Alpes'
  | 'Bourgogne-Franche-Comté'
  | 'Bretagne'
  | 'Centre-Val de Loire'
  | 'Corse'
  | 'Grand Est'
  | 'Guadeloupe'
  | 'Guyane'
  | 'Hauts-de-France'
  | 'Île-de-France'
  | 'La Réunion'
  | 'Martinique'
  | 'Mayotte'
  | 'Normandie'
  | 'Nouvelle-Aquitaine'
  | 'Occitanie'
  | 'Pays de la Loire'
  | "Provence-Alpes-Côte d'Azur";

export type OptionsGénération = { logo?: LogoDreal } & (ModèleRéponseAbandon | ModèleMiseEnDemeure);

export type GénérerModèleDocumentPort = (options: OptionsGénération) => Promise<ReadableStream>;
