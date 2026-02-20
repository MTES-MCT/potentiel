import { AppelOffre } from '@potentiel-domain/appel-offre';

import { defaultModifications } from '../../constants.js';

const garantieFinanciereEnMois = 36;

const changementsCdcModifiéOuApplicablesAPartirDeP6 = {
  nomProjet: {},
  natureDeLExploitation: {},
  typologieInstallation: {},
  siteDeProduction: {},
  représentantLégal: {
    demande: true,
    instructionAutomatique: 'accord',
  },
  actionnaire: {
    informationEnregistrée: true,
  },
  fournisseur: {
    informationEnregistrée: true,
  },
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
    autoritéCompétente: 'dgec',
  },
  installateur: {},
  dispositifDeStockage: {},
} satisfies AppelOffre.RèglesDemandesChangement;

const CDCModifié30072021: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '30/07/2021',
  donnéesCourriersRéponse: {
    texteChangementDePuissance: {
      référenceParagraphe: '5.4.4',
      dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
 Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
    },
  },
  changement: changementsCdcModifiéOuApplicablesAPartirDeP6,
};

const CDCModifié30082022: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '30/08/2022',
  numéroGestionnaireRequis: true,
  donnéesCourriersRéponse: {
    texteChangementDePuissance: {
      référenceParagraphe: '5.4.4',
      dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
    Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre,  à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée)   et  que  la  Puissance  modifiée  soit  i  nférieure  au  plafond  de  puissance  de  la  famille  dans  laquelle entre l’offre.
    Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
    Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée.`,
    },
  },
  changement: {
    ...changementsCdcModifiéOuApplicablesAPartirDeP6,
    puissance: {
      ...changementsCdcModifiéOuApplicablesAPartirDeP6.puissance,
      ratios: {
        min: changementsCdcModifiéOuApplicablesAPartirDeP6.puissance.ratios.min,
        max: 1.4,
      },
      paragrapheAlerte: `Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre, à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre. `,
    },
  },
};

const CDCModifié30082022Alternatif: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '30/08/2022',
  alternatif: true,
  numéroGestionnaireRequis: true,
  donnéesCourriersRéponse: {
    texteChangementDePuissance: {
      référenceParagraphe: '5.4.4',
      dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre, à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre.Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
    },
  },
  changement: CDCModifié30082022.changement,
};

const CDCModifié07022023: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '07/02/2023',
  numéroGestionnaireRequis: true,
  délaiAnnulationAbandon: new Date('2023-02-23'),
  changement: changementsCdcModifiéOuApplicablesAPartirDeP6,
};

const CDCModifié07022023Alternatif: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '07/02/2023',
  alternatif: true,
  numéroGestionnaireRequis: true,
  délaiAnnulationAbandon: CDCModifié07022023.délaiAnnulationAbandon,
  changement: CDCModifié07022023.changement,
};

export const zni: AppelOffre.AppelOffreReadModel = {
  id: 'CRE4 - ZNI',
  typeAppelOffre: 'zni',
  cycleAppelOffre: 'CRE4',
  title:
    'portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir de l’énergie solaire et situées dans les zones non interconnectées',
  shortTitle: 'CRE4 - ZNI',
  launchDate: 'juin 2019',
  cahiersDesChargesUrl:
    'https://www.cre.fr/documents/Appels-d-offres/appels-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-d-electricite-a-partir-de-l-energie-solaire-et-situees-d',
  technologie: 'pv',
  unitePuissance: 'MWc',
  délaiRéalisationEnMois: 24,
  changement: changementsCdcModifiéOuApplicablesAPartirDeP6,
  modification: defaultModifications,
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  paragraphePrixReference: '7.1',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFPGPFC: '3.3.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiEngagementIPFPGPFC: '3.3.6 et 7.1',
  paragrapheClauseCompetitivite: '2.8',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: true,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  garantiesFinancières: {
    typeGarantiesFinancièresDisponibles: [
      'consignation',
      'avec-date-échéance',
      'six-mois-après-achèvement',
      'type-inconnu',
    ],
    renvoiRetraitDesignationGarantieFinancieres: '5.2 et 6.2',
    renvoiSoumisAuxGarantiesFinancieres: `doit être au minimum de ${garantieFinanciereEnMois} mois`,
  },

  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.4). 
Par exception, le Candidat est délié de cette obligation : 
- en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés. 
-  en  cas  de  non  obtention  ou  de  retrait  de  toute  autre  autorisation  administrative  ou  dérogation nécessaire à la réalisation du projet. 
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée. 
Le Candidat peut également être délié de cette obligation selon appréciation du ministre chargé de l’énergie  suite  à  une  demande  dûment  justifiée.  Le  Ministre  peut  accompagner  son accord  de conditions. L’accord du Ministre et les conditions imposées le cas échéant, ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.4.4',
      dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-quinze pourcents et cent pourcents de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.`,
    },
    texteChangementDActionnariat: {
      référenceParagraphe: '5.4.2',
      dispositions: `Les modifications de la structure du capital du Candidat avant constitution des garanties financières prévues au 6.2 ne sont pas autorisées. 
Les modifications de la structure du capital du Candidat après constitution des garanties financières prévues au 6.2 sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois. A cette fin, le producteur transmet à la DREAL les copies des statuts de la société et le(s) justificatif(s) relatif à la composition de l’actionnariat. 
Si le candidat a joint à son offre la lettre d’engagement du 3.2.6, il est de sa responsabilité de s’assurer du respect de son engagement.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.4',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- 24 mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.
Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
`,
    },
  },
  champsSupplémentaires: {
    puissanceALaPointe: 'optionnel',
    territoireProjet: 'requis',
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        référence: '2019/S 113-276264',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        // 2017 ZNI avec stockage
        {
          id: '1',
          title: '1. 100kWc - 250kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '2',
          title: '2. 250kWc - 1,5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '3',
          title: '3. 250kWc - 5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        // 2019 ZNI avec stockage
        {
          id: '1a',
          title: '1a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '1b',
          title: '1b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '1c',
          title: '1c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
        // 2019 ZNI sans stockage
        {
          id: '2a',
          title: '2a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '2b',
          title: '2b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '2c',
          title: '2c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        CDCModifié30082022,
        CDCModifié30082022Alternatif,
        CDCModifié07022023,
        CDCModifié07022023Alternatif,
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
      typeImport: 'csv',
    },
    {
      id: '2',
      title: 'deuxième',
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        référence: '2019/S 113-276264',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        // 2017 ZNI avec stockage
        {
          id: '1',
          title: '1. 100kWc - 250kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '2',
          title: '2. 250kWc - 1,5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '3',
          title: '3. 250kWc - 5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        // 2019 ZNI avec stockage
        {
          id: '1a',
          title: '1a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '1b',
          title: '1b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '1c',
          title: '1c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
        // 2019 ZNI sans stockage
        {
          id: '2a',
          title: '2a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '2b',
          title: '2b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '2c',
          title: '2c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        CDCModifié30082022,
        CDCModifié30082022Alternatif,
        CDCModifié07022023,
        CDCModifié07022023Alternatif,
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
      typeImport: 'csv',
    },
    {
      id: '3',
      title: 'troisième',
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2019/S 113-276264',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        // 2017 ZNI avec stockage
        {
          id: '1',
          title: '1. 100kWc - 250kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '2',
          title: '2. 250kWc - 1,5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '3',
          title: '3. 250kWc - 5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        // 2019 ZNI avec stockage
        {
          id: '1a',
          title: '1a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '1b',
          title: '1b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '1c',
          title: '1c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
        // 2019 ZNI sans stockage
        {
          id: '2a',
          title: '2a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '2b',
          title: '2b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '2c',
          title: '2c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        CDCModifié30082022,
        CDCModifié30082022Alternatif,
        CDCModifié07022023,
        CDCModifié07022023Alternatif,
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
      typeImport: 'csv',
    },
    {
      id: '4',
      title: 'quatrième',
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2019/S 113-276264',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        // 2017 ZNI avec stockage
        {
          id: '1',
          title: '1. 100kWc - 250kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '2',
          title: '2. 250kWc - 1,5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '3',
          title: '3. 250kWc - 5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        // 2019 ZNI avec stockage
        {
          id: '1a',
          title: '1a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '1b',
          title: '1b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '1c',
          title: '1c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
        // 2019 ZNI sans stockage
        {
          id: '2a',
          title: '2a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '2b',
          title: '2b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '2c',
          title: '2c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        CDCModifié30082022,
        CDCModifié30082022Alternatif,
        CDCModifié07022023,
        CDCModifié07022023Alternatif,
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
      typeImport: 'csv',
    },
    {
      id: '5',
      title: 'cinquième',
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2019/S 113-276264',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        // 2017 ZNI avec stockage
        {
          id: '1',
          title: '1. 100kWc - 250kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '2',
          title: '2. 250kWc - 1,5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '3',
          title: '3. 250kWc - 5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        // 2019 ZNI avec stockage
        {
          id: '1a',
          title: '1a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '1b',
          title: '1b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '1c',
          title: '1c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
        // 2019 ZNI sans stockage
        {
          id: '2a',
          title: '2a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '2b',
          title: '2b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '2c',
          title: '2c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        CDCModifié30082022,
        CDCModifié30082022Alternatif,
        CDCModifié07022023,
        CDCModifié07022023Alternatif,
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
      typeImport: 'csv',
    },
    {
      id: '6',
      title: 'sixième',
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2020/S 202-487521',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' }, // à confirmer si c'est bien deux mois ici
      familles: [
        // 2017 ZNI avec stockage
        {
          id: '1',
          title: '1. 100kWc - 250kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '2',
          title: '2. 250kWc - 1,5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        {
          id: '3',
          title: '3. 250kWc - 5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
        },
        // 2019 ZNI avec stockage
        {
          id: '1a',
          title: '1a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '1b',
          title: '1b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '1c',
          title: '1c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
        // 2019 ZNI sans stockage
        {
          id: '2a',
          title: '2a. 100kWc - 500 kWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '2b',
          title: '2b. 500 kWc - 1,5MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 1.5,
        },
        {
          id: '2c',
          title: '2c. 500 kWc - 5 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 5,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [CDCModifié07022023, CDCModifié07022023Alternatif],
      typeImport: 'csv',
    },
  ],
};
