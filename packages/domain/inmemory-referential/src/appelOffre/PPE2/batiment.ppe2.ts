import { AppelOffre } from '@potentiel-domain/appel-offre';

const CDCModifié30082022: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '30/08/2022',
  numéroGestionnaireRequis: true,
  donnéesCourriersRéponse: {
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.4',
      dispositions: `Avant  l'achèvement,  les  modifications  de  la  Puissance  installée  sont  autorisées,  sous  réserve  que  la  Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre, dans la limite du plafond de puissance de 1 MWc spécifié au paragraphe 1.2.2 pour le cas d'une offre entrant dans le volume réservé. Elles doivent faire l’objet d’une information au Préfet.
    Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre,  à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si   celle-ci a été modifiée) et que la Puissance modifiée soit inférieure au plafond de puissance de 1 MWc spécifié au paragraphe 1.2.2 dans le cas d'une offre entrant dans le volume réservé.
    Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
     Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.
     Après l'achèvement, les modifications à la hausse ne sont pas acceptées.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois à compter de la Date de désignation ; 
deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement. 
Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1.1 est réduite de la durée de dépassement.
Des dérogations au délai d’Achèvement sont toutefois accordées dans le cas où des contentieux administratifs effectués à l’encontre de l’autorisation d’urbanisme liée à l’installation ou à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’Achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date de recours initial et la date de décision ayant autorité de la chose jugée est alors accordé. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès du Cocontractant. 
Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.3 et au 7.1, pour la mise en service peuvent être accordés par le Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
    },
  },
  changement: {
    nomProjet: {},
    natureDeLExploitation: {},
    siteDeProduction: {},
    puissance: {
      demande: true,
      informationEnregistrée: true,
      modificationAdmin: true,
      ratios: {
        min: 0.9,
        max: 1.4,
      },
      paragrapheAlerte: `Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre, à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) et que la Puissance modifiée soit inférieure au plafond de puissance de 1 MWc spécifié au paragraphe 1.2.2 dans le cas d'une offre entrant dans le volume réservé.`,
    },
  },
  délaiApplicable: {
    délaiEnMois: 18,
    intervaleDateMiseEnService: {
      min: new Date('2022-09-01').toISOString(),
      max: new Date('2024-12-31').toISOString(),
    },
  },
};

// Cet addendum doit-être ajouté pour PPE2 bâtiment P8 et suivantes
const addendumPériode8EtSuivantes = {
  paragrapheECS:
    "Pour rappel, le respect du bilan carbone déclaré dans l’offre, arrondi au multiple de 10 le plus proche conformément au cahier des charges, fait l’objet d’une vérification pour la délivrance de l’attestation de conformité qui est obligatoire pour la prise d'effet du contrat",
  paragraphePrix:
    "Pour rappel, la méthodologie d'évaluation carbone repose désormais uniquement sur les valeurs d'émissions de gaz à effet de serre par pays données aux tableaux 3 et, le cas échéant, 3 bis de l'annexe 2 du cahier des charges.",
};

export const batimentPPE2: AppelOffre.AppelOffreReadModel = {
  id: 'PPE2 - Bâtiment',
  typeAppelOffre: 'batiment',
  cycleAppelOffre: 'PPE2',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « Centrales sur bâtiments, serres et hangars agricoles et ombrières de parking de puissance supérieure à 500 kWc»',
  shortTitle: 'PPE2 - Bâtiment',
  launchDate: 'Août 2021',
  cahiersDesChargesUrl:
    'https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-d-electricite-a-partir-de-l-energie-solaire-centrales-s2',
  technologie: 'pv',
  unitePuissance: 'MWc',
  délaiRéalisationEnMois: 30,
  changement: {
    nomProjet: {},
    natureDeLExploitation: {},
    siteDeProduction: {},
    représentantLégal: {
      demande: true,
      modificationAdmin: true,
      instructionAutomatique: 'accord',
    },
    actionnaire: {
      informationEnregistrée: true,
      modificationAdmin: true,
    },
    fournisseur: {
      informationEnregistrée: true,
      modificationAdmin: true,
    },
    délai: {
      demande: true,
      autoritéCompétente: 'dreal',
    },
    producteur: {
      informationEnregistrée: true,
      modificationAdmin: true,
    },
    puissance: {
      informationEnregistrée: true,
      demande: true,
      modificationAdmin: true,
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
  },
  delaiRealisationTexte: 'trente (30) mois',
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '3.2.7, 4.4 et 6.5.2',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  garantiesFinancières: {
    typeGarantiesFinancièresDisponibles: [
      'consignation',
      'avec-date-échéance',
      'six-mois-après-achèvement',
      'type-inconnu',
    ],
    soumisAuxGarantiesFinancieres: 'à la candidature',
    renvoiRetraitDesignationGarantieFinancieres: '5.1',
  },
  renvoiEngagementIPFPGPFC: '3.2.7',
  paragrapheClauseCompetitivite: '2.9',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  doitPouvoirChoisirCDCInitial: true,

  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.2',
      dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du Candidat ne sont pas concernés.
- en cas de non obtention de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas sans délai le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de
conditions ou du prélèvement d’une part de la garantie financière. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.4',
      dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre, dans la limite du plafond de puissance de 1 MWc spécifié au paragraphe 1.2.2 pour le cas d'une offre entrant dans le volume réservé. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
 Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.
 Après l'achèvement, les modifications à la hausse ne sont pas acceptées.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `
      Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois à compter de la Date de désignation ;
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1.1 est réduite de la  durée de dépassement. Des dérogations au délai d’Achèvement sont toutefois accordées dans le cas où des contentieux administratifs effectués à l’encontre de l’autorisation d’urbanisme liée à l’installation ou à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’Achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date de recours initial et la date de décision ayant autorité de la chose jugée est alors accordé.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès du Cocontractant.
Des délais supplémentaires peuvent être accordés par le Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
    },
  },
  champsSupplémentaires: { typologieInstallation: 'optionnel' },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'ppe2.v1',
      cahierDesCharges: {
        référence: '2021 S 176-457518',
      },
      // Les périodes 1 à 10 ont utilisé MW
      unitéPuissance: 'MW',
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 18.79,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 26.46,
        },
      },
      cahiersDesChargesModifiésDisponibles: [CDCModifié30082022],
      abandonAvecRecandidature: true,
      typeImport: 'csv',
    },
    {
      id: '2',
      title: 'deuxième',
      certificateTemplate: 'ppe2.v1',
      cahierDesCharges: {
        référence: '2022 S 020-047803',
      },
      // Les périodes 1 à 10 ont utilisé MW
      unitéPuissance: 'MW',
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 12.9244110177221,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 11.4362187267599,
        },
      },
      cahiersDesChargesModifiésDisponibles: [CDCModifié30082022],
      abandonAvecRecandidature: true,
      typeImport: 'csv',
    },
    {
      id: '3',
      title: 'troisième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2022 S 093-254888',
      },
      // Les périodes 1 à 10 ont utilisé MW
      unitéPuissance: 'MW',
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 11.72,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 13.82,
        },
      },
      cahiersDesChargesModifiésDisponibles: [
        {
          ...CDCModifié30082022,
          délaiApplicable: undefined,
        },
      ],
      abandonAvecRecandidature: true,
      typeImport: 'csv',
    },
    {
      id: '4',
      title: 'quatrième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2022 S 216-620968',
      },
      // Les périodes 1 à 10 ont utilisé MW
      unitéPuissance: 'MW',
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 7.14,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 7.14,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
      typeImport: 'csv',
    },
    {
      id: '5',
      title: 'cinquième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2023 S 071-217458',
      },
      // Les périodes 1 à 10 ont utilisé MW
      unitéPuissance: 'MW',
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 16.69,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 15.09,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
          Par exception, le Candidat est délié de cette obligation :
          - en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du Candidat ne sont pas concernés.
          - en cas de non obtention de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
          Il en informe dans ce cas sans délai le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
          Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
      typeImport: 'csv',
    },
    {
      id: '6',
      title: 'sixième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2023/S 217-683937',
      },
      // Les périodes 1 à 10 ont utilisé MW
      unitéPuissance: 'MW',
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 23.45,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 23.45,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
          Par exception, le Candidat est délié de cette obligation :
          - en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du Candidat ne sont pas concernés.
          - en cas de non obtention de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
          Il en informe dans ce cas sans délai le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
          Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
      typeImport: 'csv',
    },
    {
      id: '7',
      title: 'septième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2024 S 061-179441',
      },
      // Les périodes 1 à 10 ont utilisé MW
      unitéPuissance: 'MW',
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 90.08,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 29.84,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
          Par exception, le Candidat est délié de cette obligation :
          - en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du Candidat ne sont pas concernés.
          - en cas de non obtention de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
          Il en informe dans ce cas sans délai le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
          Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
      typeImport: 'csv',
    },
    {
      id: '8',
      title: 'huitième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MCE',
      cahierDesCharges: {
        référence: '2024 S 420503-2024',
      },
      // Les périodes 1 à 10 ont utilisé MW
      unitéPuissance: 'MW',
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 27.31,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 24.12,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
          Par exception, le Candidat est délié de cette obligation :
          - en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du Candidat ne sont pas concernés.
          - en cas de non obtention de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
          Il en informe dans ce cas sans délai le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
          Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],

      // Cet addendum doit-être ajouté pour PPE2 bâtiment P8 et suivantes
      addendums: addendumPériode8EtSuivantes,
      typeImport: 'csv',
    },
    {
      id: '9',
      title: 'neuvième',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '2024/S 214-669140',
      },
      // Les périodes 1 à 10 ont utilisé MW
      unitéPuissance: 'MW',
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 40.32,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 31.6,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
          Par exception, le Candidat est délié de cette obligation :
          - en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du Candidat ne sont pas concernés.
          - en cas de non obtention de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
          Il en informe dans ce cas sans délai le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
          Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],

      addendums: addendumPériode8EtSuivantes,
      typeImport: 'csv',
    },
    {
      id: '10',
      title: 'dixième',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '2025/S 28-88409',
      },
      // Les périodes 1 à 10 ont utilisé MW
      unitéPuissance: 'MW',
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 21.6,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 21.6,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
          Par exception, le Candidat est délié de cette obligation :
          - en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du Candidat ne sont pas concernés.
          - en cas de non obtention de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
          Il en informe dans ce cas sans délai le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
          Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],

      addendums: addendumPériode8EtSuivantes,
      champsSupplémentaires: {
        coefficientKChoisi: 'requis',
      },
      typeImport: 'csv',
    },
    {
      id: '11',
      title: 'onzième',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '2025/S 93-00311732',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 35.77,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 35.77,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
          Par exception, le Candidat est délié de cette obligation :
          - en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du Candidat ne sont pas concernés.
          - en cas de non obtention de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
          Il en informe dans ce cas sans délai le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
          Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],

      addendums: addendumPériode8EtSuivantes,
      champsSupplémentaires: {
        coefficientKChoisi: 'requis',
      },
      typeImport: 'csv',
    },
  ],
};
