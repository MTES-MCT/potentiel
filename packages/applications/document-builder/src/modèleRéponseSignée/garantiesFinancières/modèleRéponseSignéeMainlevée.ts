export const modèleRéponseMainlevéeFileName = 'garanties-financières-mainlevée-modèle-réponse.docx';

export type ModèleRéponseMainlevée = {
  type: 'mainlevée';
  data: {
    dreal: string;
    contactDreal: string;

    dateCourrier: string;
    referenceProjet: string;

    titrePeriode: string;
    titreAppelOffre: string;
    cahierDesChargesReference: string;

    nomProjet: string;
    nomRepresentantLegal: string;
    adresseProjet: string;
    codePostalProjet: string;
    communeProjet: string;
    emailProjet: string;

    dateConstitutionGarantiesFinancières: string;

    estMotifAchèvement: boolean;
    dateTransmissionAuCocontractant: string;

    estMotifAbandon: boolean;
    dateAbandonAccordé: string;

    estAccordée: boolean;
    dateMainlevée: string;
  };
};
