import { AppelOffre } from '@potentiel-domain/appel-offre';

const garantieFinanciereEnMois = 36;

const changementsCdcModifiéOuApplicablesAPartirDeP13 = {
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
  changement: changementsCdcModifiéOuApplicablesAPartirDeP13,
};

const CDCModifié30082022: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '30/08/2022',
  numéroGestionnaireRequis: true,
  délaiApplicable: {
    délaiEnMois: 18,
    intervaleDateMiseEnService: {
      min: new Date('2022-09-01').toISOString(),
      max: new Date('2024-12-31').toISOString(),
    },
  },
  changement: {
    ...changementsCdcModifiéOuApplicablesAPartirDeP13,
    puissance: {
      ...changementsCdcModifiéOuApplicablesAPartirDeP13.puissance,
      ratios: {
        min: changementsCdcModifiéOuApplicablesAPartirDeP13.puissance.ratios.min,
        max: 1.4,
      },
      paragrapheAlerte: `Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre à condition qu’elles soient permises par l’autorisation d’urbanisme de l’Installation lorsqu’elle est requise (y compris si celle-ci a été modifiée) et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.`,
    },
  },
};

export const batiment: AppelOffre.AppelOffreReadModel = {
  id: 'CRE4 - Bâtiment',
  typeAppelOffre: 'batiment',
  cycleAppelOffre: 'CRE4',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « Centrales sur bâtiments, serres et hangars agricoles et ombrières de parking de puissance comprise entre 100 kWc et 8 MWc »',
  shortTitle: 'CRE4 - Bâtiment',
  launchDate: 'septembre 2016',
  cahiersDesChargesUrl:
    'https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-d-electricite-a-partir-de-l-energie-solaire-centrales-s',
  technologie: 'pv',
  unitePuissance: 'MWc',
  délaiRéalisationEnMois: 20,
  changement: changementsCdcModifiéOuApplicablesAPartirDeP13,
  delaiRealisationTexte: 'vingt (20) mois',
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFPGPFC: '3.2.5',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiEngagementIPFPGPFC: '3.2.5 et 7.1.2',
  paragrapheClauseCompetitivite: '2.6',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  garantiesFinancières: {
    typeGarantiesFinancièresDisponibles: [
      'consignation',
      'avec-date-échéance',
      'six-mois-après-achèvement',
      'type-inconnu',
    ],
    renvoiSoumisAuxGarantiesFinancieres: `doit être au minimum de ${garantieFinanciereEnMois.toString()} mois`,
    renvoiRetraitDesignationGarantieFinancieres: '5.3 et 6.2',
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
      dispositions: `Les modifications de la Puissance installée avant la Mise en service sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-quinze pourcents et cent pourcents de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.`,
    },
    texteChangementDActionnariat: {
      référenceParagraphe: '5.4.2',
      dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois. Si le candidat a joint à son offre la lettre d’engagement du 3.2.5, il est de sa responsabilité de s’assurer du respect de son engagement.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.4',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    !!!!!OPTION : SI PERIODE 1 à 4!!!!!En  cas  de  dépassement  de  ce  délai,  la  durée  de  contrat  de  rémunération  mentionnée  au  6.4  est  amputée d’un raccourcissement R égal à   la durée T de dépassement: R= T.
    !!!!!OPTION : SI PERIODE 5 à 13!!!!!En cas de dépassement de ce délai, le prix de référence T0 proposé   au C. du formulaire de candidature est diminué́ de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois. 
    Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
    Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
      `,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En  cas  de  dépassement  de  ce  délai,  la  durée  de  contrat  de  rémunération  mentionnée  au  6.4  est  amputée d’un raccourcissement R égal à   la durée T de dépassement: R= T.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '2',
      title: 'deuxième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En  cas  de  dépassement  de  ce  délai,  la  durée  de  contrat  de  rémunération  mentionnée  au  6.4  est  amputée d’un raccourcissement R égal à   la durée T de dépassement: R= T.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '3',
      title: 'troisième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En  cas  de  dépassement  de  ce  délai,  la  durée  de  contrat  de  rémunération  mentionnée  au  6.4  est  amputée d’un raccourcissement R égal à   la durée T de dépassement: R= T.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '4',
      title: 'quatrième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En  cas  de  dépassement  de  ce  délai,  la  durée  de  contrat  de  rémunération  mentionnée  au  6.4  est  amputée d’un raccourcissement R égal à   la durée T de dépassement: R= T.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '5',
      title: 'cinquième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En cas de dépassement de ce délai, le prix de référence T0 proposé   au C. du formulaire de candidature est diminué́ de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '6',
      title: 'sixième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En cas de dépassement de ce délai, le prix de référence T0 proposé   au C. du formulaire de candidature est diminué́ de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '7',
      title: 'septième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En cas de dépassement de ce délai, le prix de référence T0 proposé   au C. du formulaire de candidature est diminué́ de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '8',
      title: 'huitième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En cas de dépassement de ce délai, le prix de référence T0 proposé   au C. du formulaire de candidature est diminué́ de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '9',
      title: 'neuvième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En cas de dépassement de ce délai, le prix de référence T0 proposé   au C. du formulaire de candidature est diminué́ de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '10',
      title: 'dixième',
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En cas de dépassement de ce délai, le prix de référence T0 proposé   au C. du formulaire de candidature est diminué́ de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '11',
      title: 'onzième',
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En cas de dépassement de ce délai, le prix de référence T0 proposé   au C. du formulaire de candidature est diminué́ de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '12',
      title: 'douzième',
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        CDCModifié30072021,
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En cas de dépassement de ce délai, le prix de référence T0 proposé   au C. du formulaire de candidature est diminué́ de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
      changement: 'indisponible',
    },
    {
      id: '13',
      title: 'treizième',
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [
        {
          id: '1',
          title: '1. 100 kWc – 500 Mwc',
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'non soumis' },
          puissanceMax: 0.499,
        },
        {
          id: '2',
          title: '2. 500 kWc – 8 MWc',
          garantiesFinancières: {
            garantieFinanciereEnMois,
            soumisAuxGarantiesFinancieres: 'après candidature',
          },
          puissanceMax: 8,
        },
      ],
      cahiersDesChargesModifiésDisponibles: [
        {
          ...CDCModifié30082022,
          donnéesCourriersRéponse: {
            texteChangementDePuissance: {
              référenceParagraphe: '5.4.4',
              dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
        Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  àcondition  qu’elles  soient  permises  par  l’autorisation  d’urbanisme  de  l’Installation  lorsqu’elle  est  requise (y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant.
        Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
        Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
            },
            texteDélaisDAchèvement: {
              référenceParagraphe: '6.4',
              dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En cas de dépassement de ce délai, le prix de référence T0 proposé   au C. du formulaire de candidature est diminué́ de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois.
    Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux. 
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent  être  accordés  en  cas  d’événement  imprévisible à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
`,
            },
          },
        },
      ],
      abandonAvecRecandidature: true,
    },
  ],
};
