import { AppelOffre } from '@potentiel-domain/appel-offre';

const CDCModifié30082022: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '30/08/2022',
  numéroGestionnaireRequis: true,
  donnéesCourriersRéponse: {
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.3',
      dispositions: `Avant  l’achèvement,  les  modifications  de  la  Puissance  installée  sont  autorisées,  sous  réserve  que  la  Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre, dans la limite du plafond de puissance de 5 MWc spécifié au paragraphe 1.2.2 pour le cas d'une offre entrant dans le volume réservé. Elles doivent faire l’objet d’une information au Préfet.
    Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre,  à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) et que la Puissance modifiée soit :
    - Inférieure au plafond de puissance de 5 MWc spécifié au paragraphe 1.2.2 dans le cas d'une offre entrant dans le volume réservé ;
    - Inférieure  à  la  limite  de  puissance  de  30  MWc  spécifiée  au  paragraphe  2.2  si  celle-ci  est  applicable.
    Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet. Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `
          Le candidat dont l’offre a été retenue s’engage à ce que l’achèvement de son installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes : 
- trente (30) mois à compter de la date de désignation ;
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le producteur ait  mis  en  oeuvre  toutes  les  démarches  dans  le  respect  des  exigences  du  gestionnaire  de  réseau  pour  que  les  travaux  de  raccordement  soient  réalisés  dans  les  délais.  Dans  ce  cas,  l’attestation  de  conformité  doit  être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.
          Des  dérogations  au  délai  d’Achèvement  sont  toutefois  accordées  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de l’autorisation d’urbanisme liée à l’installation ou à l’encontre de  toute  autre  autorisation  administrative  nécessaire  à  la  réalisation  du  projet  ont  pour  effet  de  retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date de recours initial et la date de décision ayant autorité de la chose jugée est alors accordé. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. 
Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.3 et au 7.1, pour la mise en service peuvent être accordés par le Préfet, à  son  appréciation,  en  cas  d’événement  imprévisible  à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
    },
  },
  changement: {
    natureDeLExploitation: {},
    puissance: {
      demande: true,
      ratios: {
        min: 0.9,
        max: 1.4,
      },
      paragrapheAlerte: `Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre, à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) et que la Puissance modifiée soit : 
- Inférieure au plafond de puissance de 5 MWc spécifié au paragraphe 1.2.2 dans le cas d'une offre entrant dans le volume réservé ; 
- Inférieure à la limite de puissance de 30 MWc spécifiée au paragraphe 2.2 si celle-ci est applicable. 
`,
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

export const solPPE2: AppelOffre.AppelOffreReadModel = {
  id: 'PPE2 - Sol',
  typeAppelOffre: 'sol',
  cycleAppelOffre: 'PPE2',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « Centrales au sol »',
  shortTitle: 'PPE2 - Sol',
  launchDate: 'Août 2021',
  cahiersDesChargesUrl:
    'https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-d-electricite-a-partir-de-l-energie-solaire-centrales-a2',
  technologie: 'pv',
  unitePuissance: 'MWc',
  changement: {
    natureDeLExploitation: {},
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
    },
    abandon: {
      demande: true,
      autoritéCompétente: 'dgec',
    },
  },
  délaiRéalisationEnMois: 30,
  delaiRealisationTexte: 'trente (30) mois',
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFPGPFC: '3.2.7, 4.5 et 6.6.2',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiEngagementIPFPGPFC: '3.2.7',
  paragrapheClauseCompetitivite: '2.10',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  doitPouvoirChoisirCDCInitial: true,
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
  changementProducteurPossibleAvantAchèvement: true,
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.2',
      dispositions: `Le candidat dont l’offre a été retenue met en service l’installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
- en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de
conditions ou du prélèvement d’une part de la garantie financière. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.3',
      dispositions: `Avant l’achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre, dans la limite du plafond de puissance de 5 MWc spécifié au paragraphe 1.2.2 pour le cas d'une offre entrant dans le volume réservé. Elles doivent faire l’objet d’une information au Préfet. 
Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet. Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée. Après l'achèvement, les modifications à la hausse ne sont pas acceptées.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `Le candidat dont l’offre a été retenue s’engage à ce que l’achèvement de son installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois à compter de la date de désignation ;
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la  durée de dépassement.
Des dérogations au délai d’Achèvement sont toutefois accordées dans le cas où des contentieux administratifs effectués à l’encontre de l’autorisation d’urbanisme liée à l’installation ou à  l’encontre de toute autre autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date de recours initial et la date de décision ayant autorité de la chose jugée  est alors accordé.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires peuvent être accordés par le Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      // les périodes 1 à 7 ont utilisé MW
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v1',
      cahierDesCharges: {
        référence: '2021 S 211-553136',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 46.95,
          puissanceMax: 5,
        },
        autres: {
          noteThreshold: 54.9,
        },
      },
      cahiersDesChargesModifiésDisponibles: [CDCModifié30082022],
      abandonAvecRecandidature: true,
    },
    {
      id: '2',
      title: 'deuxième',
      // les périodes 1 à 7 ont utilisé MW
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v1',
      cahierDesCharges: {
        référence: '2022/S 061-160516',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 35.25,
          puissanceMax: 5,
        },
        autres: {
          noteThreshold: 46.74,
        },
      },
      cahiersDesChargesModifiésDisponibles: [
        {
          ...CDCModifié30082022,
          délaiApplicable: undefined,
        },
      ],
      abandonAvecRecandidature: true,
    },
    {
      id: '3',
      title: 'troisième',
      // les périodes 1 à 7 ont utilisé MW
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2022 S 214-614411',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 33.95,
          puissanceMax: 5,
        },
        autres: {
          noteThreshold: 14.16,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
    },
    {
      id: '4',
      title: 'quatrième',
      // les périodes 1 à 7 ont utilisé MW
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2023 S 063-187860',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 17.96,
          puissanceMax: 5,
        },
        autres: {
          noteThreshold: 17.34,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
˗ en cas de retrait de l’autorisation par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
˗ en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
    },
    {
      id: '5',
      title: 'cinquième',
      // les périodes 1 à 7 ont utilisé MW
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2023/S 217-681379',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 15.57,
          puissanceMax: 5,
        },
        autres: {
          noteThreshold: 15.57,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
˗ en cas de retrait de l’autorisation par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
˗ en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
    },
    {
      id: '6',
      title: 'sixième',
      // les périodes 1 à 7 ont utilisé MW
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v2',
      logo: 'MCE',
      cahierDesCharges: {
        référence: '2024/S 422369-2024',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 18.97,
          puissanceMax: 5,
        },
        autres: {
          noteThreshold: 26.98,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
˗ en cas de retrait de l’autorisation par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
˗ en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
    },
    {
      id: '7',
      title: 'septième',
      // les périodes 1 à 7 ont utilisé MW
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '2021/S 146-385911',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 25.98,
          puissanceMax: 5,
        },
        autres: {
          noteThreshold: 25.98,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
˗ en cas de retrait de l’autorisation par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
˗ en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
    },
    {
      id: '8',
      title: 'huitième',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '2025/S 059-190628',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 25.08,
          puissanceMax: 5,
        },
        autres: {
          noteThreshold: 23.02,
        },
      },
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
˗ en cas de retrait de l’autorisation par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
˗ en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
      champsSupplémentaires: {
        coefficientKChoisi: 'requis',
      },
    },
  ],
};
