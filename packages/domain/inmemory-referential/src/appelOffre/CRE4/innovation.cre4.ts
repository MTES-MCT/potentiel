import { AppelOffre } from '@potentiel-domain/appel-offre';

const changementsCDCModifié = {
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
      min: 0.7,
      max: 1,
    },
  },
  recours: {
    demande: true,
  },
  abandon: {
    demande: true,
    autoritéCompétente: 'dgec',
  },
} satisfies AppelOffre.RèglesDemandesChangement;

const CDCModifié30072021: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '30/07/2021',
  donnéesCourriersRéponse: {
    texteChangementDePuissance: {
      référenceParagraphe: '5.4.5',
      dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre soixante-dix pourcents (70%) et cent pourcents (100%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications à la baisse, en-dessous de 70% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
 Des modifications à la baisse, en-dessous de 70% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
    },
  },
  changement: changementsCDCModifié,
};

const CDCModifié30082022: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '30/08/2022',
  numéroGestionnaireRequis: true,
  donnéesCourriersRéponse: {
    texteChangementDePuissance: {
      référenceParagraphe: '5.4.5',
      dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre soixante-dix pourcents (70%) et cent pourcents (100%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre,  à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit :
        - Inférieure au plafond de puissance de la famille dans laquelle entre l’offre ;
        - Inférieure à la limite de puissance de 3 MWc pour la période 1 ou de 5 MWc pour les périodes 2 et 3, mentionnée au 2.2.
        Les modifications à la baisse, en-dessous de 70% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 70% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `
          Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
* vingt-quatre (24) mois à compter de la Date de désignation.
* deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
Pour  les  installations  dont  la  mise  en  service  a  lieu  entre  le  1er  septembre  2022  et  le  31  décembre  2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.
          Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux  administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service,  laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible  à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
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
  changement: {
    ...changementsCDCModifié,
    puissance: {
      ...changementsCDCModifié.puissance,
      ratios: {
        min: changementsCDCModifié.puissance.ratios.min,
        max: 1.4,
      },
      paragrapheAlerte: `Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre, à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) et que la Puissance modifiée soit : 
  - Inférieure au plafond de puissance de la famille dans laquelle entre l’offre ; 
  - Inférieure à la limite de puissance de 3 MWc pour la période 1 ou de 5 MWc pour les périodes 2 et 3, mentionnée au 2.2. 
  `,
    },
  },
};

export const innovation: AppelOffre.AppelOffreReadModel = {
  id: 'CRE4 - Innovation',
  typeAppelOffre: 'innovation',
  cycleAppelOffre: 'CRE4',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité innovantes à partir de l’énergie solaire, sans dispositifs de stockage',
  shortTitle: 'CRE4 - Innovation',
  launchDate: 'mars 2017',
  cahiersDesChargesUrl:
    'https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-d-electricite-innovantes-a-partir-de-l-energie-solaire',
  technologie: 'pv',
  unitePuissance: 'MWc',
  délaiRéalisationEnMois: 24,
  changement: 'indisponible',
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  paragraphePrixReference: '7.1',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  garantiesFinancières: {
    typeGarantiesFinancièresDisponibles: [
      'consignation',
      'avec-date-échéance',
      'six-mois-après-achèvement',
      'type-inconnu',
    ],
    renvoiRetraitDesignationGarantieFinancieres: '5.3',
  },
  changementProducteurPossibleAvantAchèvement: true,
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.4). 
Par exception, le Candidat est délié de cette obligation : 
- en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés. 
-  en  cas  de  non  obtention  ou  de  retrait  de  toute  autre  autorisation  administrative  ou  dérogation nécessaire à la réalisation du projet. 
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée. 
Le Candidat peut également être délié de cette obligation selon appréciation du ministre chargé de l’énergie  suite  à  une  demande  dûment  justifiée.  Le  Ministre  peut  accompagner  son accord  de conditions. L’accord du Ministre et les conditions imposées le cas échéant, ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.

Le Candidat dont l’offre a été retenue met en oeuvre les éléments, dispositifs et systèmes innovants décrits dans son offre (cf. 3.2.5 et 3.2.6) sur toute leur durée de vie de manière à ce que leur performance puisse être analysée sur une longue période.`,
    },
    texteChangementDActionnariat: {
      référenceParagraphe: '5.4.2',
      dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois. A cette fin, le producteur transmet à la DREAL les copies des statuts de la société et le(s) justificatif(s) relatif à la composition de l’actionnariat. `,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `
      Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.
Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 051-094731',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1a',
          title: "1a. Nouvelles conceptions d'intégration",
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.5,
        },
        {
          id: '1b',
          title: '1b. Autres innovations de composants',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 3,
        },
        {
          id: '2',
          title: '2. 100 kWc - 3MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 3,
        },
        {
          id: '3',
          title:
            "3. Innovation liée à l'optimisation et à l'exploitation électrique de la centrale",
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 3,
        },
        {
          id: '4',
          title: '4. Agrivoltaïsme',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 3,
        },
      ],
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.4.5',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre soixante-dix pourcents et cent pourcents de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [CDCModifié30072021, CDCModifié30082022],
      abandonAvecRecandidature: true,
    },
    {
      id: '2',
      title: 'deuxième',
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        référence: '2017/S 051-094731',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 500 kWc - 5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 5,
        },
        {
          id: '2',
          title: '2. 100 kWc - 3MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 3,
        },
      ],
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.4.5',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre soixante-dix pourcents et cent pourcents de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [CDCModifié30072021, CDCModifié30082022],
      abandonAvecRecandidature: true,
    },
    {
      id: '3',
      title: 'troisième',
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2017/S 051-094731',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 500 kWc - 5MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 5,
        },
        {
          id: '2',
          title: '2. 100 kWc - 3MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 3,
        },
      ],
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.4.5',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-quinze pourcents et cent pourcents de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [CDCModifié30072021, CDCModifié30082022],
      abandonAvecRecandidature: true,
    },
  ],
};
