import { AppelOffre } from '@potentiel-domain/appel-offre';

const CDCModifié30082022: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '30/08/2022',
  numéroGestionnaireRequis: true,
  donnéesCourriersRéponse: {
    texteChangementDePuissance: {
      référenceParagraphe: '5.7',
      dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingts pourcents (80 %) et cent vingt pourcents (120 %) de la Puissance indiquée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
    Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre, à condition qu’elle soit permise par l’autorisation environnementale de l’Installation, y compris si celle-ci a été modifiée.
    Les modifications après l’Achèvement ou hors de cette fourchette ne sont pas autorisées.
    Par dérogation, les modifications à la baisse de la Puissance installée qui seraient imposées soit par une décision de l’Etat dans le cadre de la procédure d’autorisation, ou par une décision de justice concernant l’autorisation sont acceptées. Elles doivent faire l’objet d’une information au Préfet.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `
          Le  Candidat  dont  l’offre  a  été  retenue  s’engage  à  ce  que  l’Achèvement  de  son  Installation  intervienne avant une limite définie par la date la plus tardive des deux dates suivantes : 
-trente-six (36) mois à compter de la Date de désignation. 
-deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par  le producteur pour sa contribution au coût du raccordement. 
Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement. 
Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux  administratifs  effectués  à  l’encontre  de  toute autorisation  administrative  nécessaire  à  la  réalisation  du     projet     ont     pour     effet     de     retarder     la     construction     de     l’installation.     Dans     ce     cas,  un  délai  supplémentaire  égal  à  la  durée  entre  la  date  du  recours  initial  et  la  date  de  la  décision  définitive attestée par la décision ayant autorité de la chose jugée est alors accordé. 
 Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. 
Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.3 et au 7.1, pour la mise en service peuvent être accordés par le Préfet, à  son  appréciation,  en  cas  d’événement  imprévisible  à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
    `,
    },
  },
  délaiApplicable: {
    délaiEnMois: 18,
    intervaleDateMiseEnService: {
      min: new Date('2022-06-01').toISOString(),
      max: new Date('2024-09-30').toISOString(),
    },
  },
  changement: {
    puissance: {
      demande: true,
      ratios: {
        min: 0.8,
        max: 1.4,
      },
      paragrapheAlerte: `Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre, à condition qu’elle soit permise par l’autorisation environnementale de l’Installation, y compris si celle-ci a été modifiée.`,
    },
  },
};

const texteEngagementRéalisationEtModalitésAbandonAPartirDeP4 = {
  référenceParagraphe: '6.2',
  dispositions: `Le Candidat dont l’offre a été retenue réalise l’Installation dans les conditions du présent cahier des charges et conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de retrait de l’autorisation environnementale par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
- en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. Ni l’accord du Ministre, ni les conditions imposées, ni le prélèvement de la garantie financière ne limitent la possibilité de recours de l’État aux sanctions du 7.8.`,
};

export const eolienPPE2: AppelOffre.AppelOffreReadModel = {
  id: 'PPE2 - Eolien',
  typeAppelOffre: 'eolien',
  cycleAppelOffre: 'PPE2',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie mécanique du vent implantées à terre',
  shortTitle: 'PPE2 - Eolien',
  dossierSuiviPar: 'aoeolien@developpement-durable.gouv.fr',
  launchDate: 'Août 2021',
  cahiersDesChargesUrl:
    'https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-d-electricite-a-partir-de-l-energie-mecanique-du-vent-imp',
  technologie: 'eolien',
  unitePuissance: 'MW',
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
        min: 0.8,
        max: 1.2,
      },
    },
    recours: {
      demande: true,
    },
    abandon: {
      demande: true,
      autoritéCompétente: 'dgec',
    },
    installateur: {},
  },
  tarifOuPrimeRetenue: 'le prix de référence T de l’électricité retenu',
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  paragraphePrixReference: '7',
  affichageParagrapheECS: false,
  paragrapheEngagementIPFPGPFC: '3.3.7, 4.3 et 6.5.2',
  renvoiEngagementIPFPGPFC: '3.3.7',
  renvoiDemandeCompleteRaccordement: '6.1',
  paragrapheDelaiDerogatoire: '6.3',
  délaiRéalisationEnMois: 36,
  delaiRealisationTexte: 'trente-six (36) mois',
  paragrapheAttestationConformite: '6.5',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  paragrapheClauseCompetitivite: '2.11',
  afficherPhraseRegionImplantation: false,
  afficherValeurEvaluationCarbone: true,
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

  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.2',
      dispositions: `Le Candidat dont l’offre a été retenue réalise l’Installation dans les conditions du présent cahier des charges et conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de retrait de l’autorisation environnementale par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
- en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de conditions ou du prélèvement d’une part de la garantie financière. Ni l’accord du Ministre, ni les conditions imposées, ni le prélèvement de la garantie financière ne limitent la possibilité de recours de l’Etat aux sanctions du 8.2. 
`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.7',
      dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingts pourcents (80 %) et cent vingt pourcents (120 %) de la Puissance indiquée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications après l’Achèvement ou hors de cette fourchette ne sont pas autorisées.
 Par dérogation, les modifications à la baisse de la Puissance installée qui seraient imposées soit par une décision de l’Etat dans le cadre de la procédure d’autorisation, ou par une décision de justice concernant l’autorisation sont acceptées. Elles doivent faire l’objet d’une information au Préfet.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente-six (36) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation  de conformité doit être transmise au cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la  durée de dépassement.
Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder la construction de l’installation ou sa mise en service. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires peuvent être accordés par le Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'ppe2.v1',
      cahierDesCharges: {
        référence: '2021/S 146-386083',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      cahiersDesChargesModifiésDisponibles: [CDCModifié30082022],
      abandonAvecRecandidature: true,
      changement: {
        représentantLégal: {
          demande: true,
          instructionAutomatique: 'rejet',
        },
      },
      typeImport: 'csv',
    },
    {
      id: '2',
      title: 'deuxième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2022/S 035-088651',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      cahiersDesChargesModifiésDisponibles: [
        {
          ...CDCModifié30082022,
          délaiApplicable: undefined,
        },
      ],
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue réalise l’Installation dans les conditions du présent cahier des charges et conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de retrait de l’autorisation environnementale par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
- en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de conditions ou du prélèvement d’une part de la garantie financière. Ni l’accord du Ministre, ni les conditions imposées, ni le prélèvement de la garantie financière ne limitent la possibilité de recours de l’État aux sanctions du 7.8. 
`,
        },
      },
      abandonAvecRecandidature: true,
      changement: {
        représentantLégal: {
          demande: true,
          instructionAutomatique: 'rejet',
        },
      },
      typeImport: 'csv',
    },
    {
      id: '3',
      title: 'troisième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2022/S 214-614410',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue réalise l’Installation dans les conditions du présent cahier des charges et conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de retrait de l’autorisation environnementale par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
- en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de conditions ou du prélèvement d’une part de la garantie financière. Ni l’accord du Ministre, ni les conditions imposées, ni le prélèvement de la garantie financière ne limitent la possibilité de recours de l’État aux sanctions du 7.8. 
`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
      paragrapheEngagementIPFPGPFC: '3.3.8, 4.3 et 6.5.2',
      changement: {
        représentantLégal: {
          demande: true,
          instructionAutomatique: 'rejet',
        },
      },
      typeImport: 'csv',
    },
    {
      id: '4',
      title: 'quatrième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2023/S 063-187148',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon:
          texteEngagementRéalisationEtModalitésAbandonAPartirDeP4,
      },
      cahiersDesChargesModifiésDisponibles: [],
      paragrapheEngagementIPFPGPFC: '3.3.8, 4.3 et 6.5.2',
      changement: {
        représentantLégal: {
          demande: true,
          instructionAutomatique: 'rejet',
        },
      },
      typeImport: 'csv',
    },
    {
      id: '5',
      title: 'cinquième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2023/S 183-570186',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon:
          texteEngagementRéalisationEtModalitésAbandonAPartirDeP4,
      },
      cahiersDesChargesModifiésDisponibles: [],
      paragrapheEngagementIPFPGPFC: '3.3.8, 4.3 et 6.5.2',
      changement: {
        représentantLégal: {
          demande: true,
          instructionAutomatique: 'rejet',
        },
      },
      typeImport: 'csv',
    },
    {
      id: '6',
      title: 'sixième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2023/S 215-677967',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon:
          texteEngagementRéalisationEtModalitésAbandonAPartirDeP4,
      },
      cahiersDesChargesModifiésDisponibles: [],
      paragrapheEngagementIPFPGPFC: '3.3.8, 4.3 et 6.5.2',
      changement: {
        représentantLégal: {
          demande: true,
          instructionAutomatique: 'rejet',
        },
      },
      typeImport: 'csv',
    },
    {
      id: '7',
      title: 'septième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2024/S 64-189193',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon:
          texteEngagementRéalisationEtModalitésAbandonAPartirDeP4,
      },
      cahiersDesChargesModifiésDisponibles: [],
      paragrapheEngagementIPFPGPFC: '3.3.8, 4.3 et 6.5.2',
      changement: {
        représentantLégal: {
          demande: true,
          instructionAutomatique: 'rejet',
        },
      },
      typeImport: 'csv',
    },
    {
      id: '8',
      title: 'huitième',
      certificateTemplate: 'ppe2.v2',
      logo: 'MCE',
      cahierDesCharges: {
        référence: '2024/S 419522-2024',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon:
          texteEngagementRéalisationEtModalitésAbandonAPartirDeP4,
      },
      cahiersDesChargesModifiésDisponibles: [],
      paragrapheEngagementIPFPGPFC: '3.3.8, 4.3 et 6.5.2',
      changement: {
        représentantLégal: {
          demande: true,
          instructionAutomatique: 'rejet',
        },
      },
      typeImport: 'csv',
    },
    {
      id: '9',
      title: 'neuvième',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '2025/S 10841-2025',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon:
          texteEngagementRéalisationEtModalitésAbandonAPartirDeP4,
      },
      cahiersDesChargesModifiésDisponibles: [],
      paragrapheEngagementIPFPGPFC: '3.3.8, 4.3 et 6.5.2',
      typeImport: 'csv',
    },
    {
      id: '10',
      title: 'dixième',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '2025/S 322887-2025',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon:
          texteEngagementRéalisationEtModalitésAbandonAPartirDeP4,
      },
      cahiersDesChargesModifiésDisponibles: [],
      paragrapheEngagementIPFPGPFC: '3.3.8, 4.3 et 6.5.2',
      champsSupplémentaires: {
        coefficientKChoisi: 'requis',
      },
      typeImport: 'csv',
    },
  ],
};
