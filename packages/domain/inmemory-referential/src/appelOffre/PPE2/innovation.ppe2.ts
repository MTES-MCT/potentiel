import { AppelOffre } from '@potentiel-domain/appel-offre';

const CDCModifié30082022: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '30/08/2022',
  numéroGestionnaireRequis: true,
  donnéesCourriersRéponse: {
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.4',
      dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre soixante-dix pourcents (70%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.
    Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) lorsqu’elle est requise par le code de l’urbanisme et que la Puissance modifiée soit :
    - Inférieure au plafond de puissance de la famille dans laquelle entre l’offre ;
    - Inférieure à la limite de puissance de 5 MWc spécifiée au paragraphe 2.2.
     Les modifications à la baisse de la Puissance installée qui seraient imposées soit par une décision de l’Etat dans le cadre de la procédure d’autorisation, ou par une décision de justice concernant l’autorisation d’urbanisme sont acceptées. Elles doivent faire l’objet d’une information au Préfet.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -trente (30) mois à compter de la Date de désignation.
    -deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1.1 est réduite de la durée de dépassement.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux  administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. 
Dans  ce  cas,  un  délai  supplémentaire  égal  à  la  durée  entre  la  date  du  recours  initial  et  la  date  de  la  décision  définitive  attestée  par  la  décision  ayant  autorité  de  la  chose  jugée  est  alors  accordé.  Ces  retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. 
Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024  mentionnée  au  présent  6.3  et  au  7.1.1,  pour  la  mise  en  service  peuvent  être  accordés  par  le  Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
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
    puissance: {
      demande: true,
      ratios: {
        min: 0.7,
        max: 1.4,
      },
      paragrapheAlerte: `Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) lorsqu’elle est requise par le code de l’urbanisme et que la Puissance modifiée soit : 
- Inférieure au plafond de puissance de la famille dans laquelle entre l’offre ; 
- Inférieure à la limite de puissance de 5 MWc spécifiée au paragraphe 2.2. 
`,
    },
  },
};

export const innovationPPE2: AppelOffre.AppelOffreReadModel = {
  id: 'PPE2 - Innovation',
  typeAppelOffre: 'innovation',
  cycleAppelOffre: 'PPE2',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité innovantes à partir de l’énergie solaire sans dispositifs de stockage',
  shortTitle: 'PPE2 - Innovation',
  launchDate: 'Août 2021',
  cahiersDesChargesUrl:
    'https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-d-electricite-innovantes-a-partir-de-l-energie-solaire-sa',
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
        min: 0.7,
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
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  doitPouvoirChoisirCDCInitial: true,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  garantiesFinancières: {
    typeGarantiesFinancièresDisponibles: [
      'consignation',
      'avec-date-échéance',
      'six-mois-après-achèvement',
      'type-inconnu',
    ],
    renvoiRetraitDesignationGarantieFinancieres: '',
  },

  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.2',
      dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de non délivrance de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux.
- en cas de non obtention de toute autre autorisation administrative nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de conditions.
Le Candidat dont l’offre a été retenue met en oeuvre les éléments, dispositifs et systèmes innovants décrits dans son offre (cf. 3.2.4 et 3.2.5) sur toute leur durée de vie de manière à ce que leur performance puisse être analysée sur une longue période. 
`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.4',
      dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre soixante-dix pourcents (70%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.
 Les modifications à la baisse de la Puissance installée qui seraient imposées soit par une décision de l’Etat dans le cadre de la procédure d’autorisation, ou par une décision de justice concernant l’autorisation d’urbanisme sont acceptées. Elles doivent faire l’objet d’une information au Préfet.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1.1 est réduite de la  durée de dépassement.
Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires peuvent être accordés par le Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2021 S 203-530267',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [
        {
          id: '1',
          title:
            'Installations photovoltaïques innovantes au sol de Puissance strictement supérieure à 500 kWc et inférieure ou égale à 3 MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 3,
        },
        {
          id: '2',
          title:
            'Installations photovoltaïques innovantes sur Bâtiments, Serres agricoles Hangars, Ombrières, ou Installations agrivoltaïques innovantes de Puissance strictement supérieure à 100 kWc et inférieure ou égale à 3 MWc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 3,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [CDCModifié30082022],
      abandonAvecRecandidature: true,
      typeImport: 'csv',
    },
    // ℹ️ penser à mettre à jour le logo pour la prochaine période
    // ℹ️ penser à retirer l'unité de puissance pour la prochaine période (utiliser celle par défaut de l'AO)
  ],
};
