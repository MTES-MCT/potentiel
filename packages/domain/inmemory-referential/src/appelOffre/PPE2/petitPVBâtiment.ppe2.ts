import { AppelOffre } from '@potentiel-domain/appel-offre';

export const petitPVBâtimentPPE2: AppelOffre.AppelOffreReadModel = {
  id: 'PPE2 - Petit PV Bâtiment',
  typeAppelOffre: 'batiment',
  cycleAppelOffre: 'PPE2',
  title: `portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « Centrales sur bâtiments ou ombrières de puissance supérieure à 100 kWc et inférieure à 500 kWc »`,
  shortTitle: 'PPE2 - Petit PV Bâtiment',
  launchDate: 'Septembre 2025',
  cahiersDesChargesUrl: `https://www.cre.fr/documents/appels-doffres/appel-doffres-portant-sur-la-realisation-et-lexploitation-dinstallations-de-production-delectricite-a-partir-de-lenergie-solaire-centrales-sur-batiments-ou-ombrieres-de-puissance-superieure-a-100-kwc-et-inferieure-a-500-kwc.html`,
  technologie: 'pv',
  unitePuissance: 'MWc',
  délaiRéalisationEnMois: 34,
  delaiRealisationTexte: 'trente-quatre (34) mois',
  transmissionAutomatiséeDesDonnéesDeContractualisationAuCocontractant: true,
  changement: {
    nomProjet: {
      informationEnregistrée: true,
    },
    natureDeLExploitation: { informationEnregistrée: true },
    siteDeProduction: {},
    représentantLégal: {
      informationEnregistrée: true,
    },
    actionnaire: {},
    fournisseur: {},
    délai: {
      demande: true,
      autoritéCompétente: 'dreal',
    },
    producteur: {
      informationEnregistrée: true,
    },
    puissance: {
      informationEnregistrée: true,
      demande: true,
      ratios: {
        min: 0.9,
        max: 1.1,
      },
    },
    recours: {
      demande: true,
      autoritéCompétente: 'dgec',
    },
    abandon: {
      demande: true,
      autoritéCompétente: 'dreal',
    },
    installateur: {
      informationEnregistrée: true,
    },
    dispositifDeStockage: {
      informationEnregistrée: true,
    },
  },
  modification: {
    siteDeProduction: {
      modificationAdmin: true,
    },
    représentantLégal: {
      modificationAdmin: true,
    },
    actionnaire: {},
    fournisseur: {},
    producteur: {
      modificationAdmin: true,
    },
    puissance: {
      modificationAdmin: true,
    },
    nomProjet: { modificationAdmin: true },
    natureDeLExploitation: { modificationAdmin: true },
    installateur: { modificationAdmin: true },
    dispositifDeStockage: { modificationAdmin: true },
    délai: {},
    abandon: {},
    recours: {},
  },
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  garantiesFinancières: {
    typeGarantiesFinancièresDisponibles: ['consignation', 'avec-date-échéance', 'exemption'],
    soumisAuxGarantiesFinancieres: 'à la candidature',
    renvoiRetraitDesignationGarantieFinancieres: '5.1',
    délaiÉchéanceGarantieBancaireEnMois: 48,
  },
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '1.3.4',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  afficherParagrapheAutorisationUrbanisme: true,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  doitPouvoirChoisirCDCInitial: true,

  dépôtDCRPossibleSeulementAprèsDésignation: true,
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.2',
      dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de retrait de l’autorisation d’urbanisme mentionnée au 2.2 ou de toute autorisation nécessaire à la mise en œuvre de l’Installation par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du Candidat ne sont pas concernés ;
- en cas d’abandon pour cause de proposition de raccordement par le gestionnaire de réseau indiquant un devis avec un coût de raccordement dépassant le seuil de 0,25€/Wc. Ce seuil est apprécié au regard du montant total de la contribution financière (TTC) du producteur, quote-part incluse et après réfaction ;
- en cas d’abandon pour cause de délai de raccordement, indiqué dans l’offre de raccordement du gestionnaire de réseau, supérieur à 24 mois ou d’information par le gestionnaire de réseau de la suspension du traitement de la demande de raccordement jusqu’à la révision du S3REnR.
Il en informe dans ces cas sans délai le Préfet en joignant les pièces justificatives sur Potentiel. Dans ces situations, le Préfet lui remet une mainlevée permettant de lever sa garantie financière. 
Le Candidat peut également être délié de cette obligation selon l’appréciation du Préfet à la suite d’une demande dûment justifiée. Le Préfet peut toutefois prélever la totalité ou une part de la garantie financière selon les dispositions du 5.1. L’accord du Préfet, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.3',
      dispositions: `Avant l'Achèvement, les modifications de la Puissance de l’Installation sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110 %) de la Puissance de l’Installation formulée dans l’offre, dans la limite des seuils d’éligibilité au présent appel d’offres. Elles doivent faire l’objet d’une information aux entités indiquées au 5.2.
Les modifications à la baisse, en-dessous de 90 % de la Puissance formulée dans l'offre et imposées par une décision de l’État relative à toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées.
Des modifications à la baisse, en-dessous de 90 % de la Puissance formulée dans l'offre et imposées par un événement extérieur au Candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.
Après l'Achèvement, les modifications à la hausse ne sont pas autorisées et les modifications à la baisse sont autorisées et font l’objet d’une information à l’entité indiquée au 5.2 accompagnée d’une nouvelle attestation mentionnée au 6.5. Celle-ci porte seulement sur les éléments modifiés.
Si ces modifications interviennent après la signature du contrat de complément de rémunération, le producteur doit effectuer une demande de modification du contrat, accompagnée de la nouvelle attestation.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant trente-quatre (34) mois à compter de la Date de désignation. En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.2.1 est réduite de la durée de dépassement et le Préfet peut prélever la totalité ou une partie de la garantie financière, conformément au 5.1. Le prélèvement de la garantie financière ne limite pas la possibilité de recours de l’État aux sanctions du 8.2. 
Des dérogations au délai d’Achèvement sont toutefois accordées dans le cas où des contentieux administratifs effectués à l’encontre de l’autorisation d’urbanisme liée à l’installation ou à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’Achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date de recours initial et la date de décision ayant autorité de la chose jugée est alors accordé. Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès du Cocontractant. 
Des délais supplémentaires peuvent être accordés par le Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié. 
De plus, dans le cas où le Candidat a fourni une garantie à première demande comme garantie financière, si un prolongement de délai a été accordé, le Producteur doit fournir, par voie dématérialisée dans son espace Potentiel, au plus tard deux mois avant l’échéance de la garantie en cours, une garantie financière conforme au 3.2.3. Cette garantie pourra prendre la forme d’une consignation auprès de la Caisse des dépôts et consignations ou d’une autre garantie à première demande conforme au modèle en Annexe 2, d’une durée minimale de trente-six (36) mois à compter de l’échéance de la garantie en cours. Si le renouvellement n’a pas eu lieu avant cette échéance, l’État peut prélever la totalité ou une partie de la garantie en cours, conformément au 5.1. Cette garantie devra être renouvelée dans ces mêmes conditions si la durée de prolongement accordée dépasse le délai de la garantie en cours.`,
    },
  },
  champsSupplémentaires: {
    puissanceDeSite: 'requis',
    autorisationDUrbanisme: 'requis',
    installateur: 'optionnel',
    dispositifDeStockage: 'requis',
    natureDeLExploitation: 'requis',
    coefficientKChoisi: 'requis',
    typologieInstallation: 'requis',
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '2025/S 513616-2025',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      cahiersDesChargesModifiésDisponibles: [],
      // si CDC modifié ajouté, vérifier si retour au CDC initial possible
      champsSupplémentaires: {},
      addendums: {
        paragrapheECS:
          "Pour rappel, la conformité de l’autorisation d’urbanisme et  le respect du bilan carbone déclaré dans l’offre, arrondi au multiple de 10 le plus proche conformément au cahier des charges, fait l’objet d’une vérification pour la délivrance de l’attestation de conformité qui est obligatoire pour la prise d'effet du contrat",
        paragraphePrix:
          "Pour rappel, la méthodologie d'évaluation carbone repose désormais uniquement sur les valeurs d'émissions de gaz à effet de serre par pays données aux tableaux 3 de l'annexe 2 du cahier des charges.",
      },
      typeImport: 'démarche-simplifiée',
    },
  ],
};
