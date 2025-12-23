import { AppelOffre } from '@potentiel-domain/appel-offre';

import { defaultModifications } from '../../constants';

const CDCModifié30082022: AppelOffre.CahierDesChargesModifié = {
  type: 'modifié',
  paruLe: '30/08/2022',
  numéroGestionnaireRequis: true,
  donnéesCourriersRéponse: {
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.4',
      dispositions: `Avant  l’achèvement,  les  modifications  de  la  Puissance  installée  sont  autorisées,  sous  réserve  que  la  Puissance de l’Installation modifiée soit comprise :
    •entre quatre-vingt-dix pourcents (90 %) et cent-dix pourcents (110 %) de la Puissance indiquée dans l’offre pour les projets photovoltaïques;
    •entre quatre-vingt pourcents (80 %) et cent-vingt pourcents (120 %) de la Puissance indiquée dans l’offre pour les projets éoliens .
    Elles doivent faire l’objet d’une information au Préfet.
    Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) ou par l’autorisation environnementale de l’Installation (y compris si celle-ci a été modifiée) et  que  la  Puissance  modifiée  soit inférieure  à  la  limite  de  puissance  spécifiée  au  paragraphe  2.2  applicable à l’Installation.
    Les modifications à la baisse, en-dessous de :
     • quatre-vingt-dix pourcents (90 %) de la Puissance indiquée dans l’offre pour les projets photovoltaïques,
     • quatre-vingt pourcents (80 %) de la Puissance indiquée dans l’offre pour les projets éoliens,
     et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
     Des modifications à la baisse, en-dessous de :
     • quatre-vingt-dix pourcents (90 %) de la Puissance indiquée dans l’offre pour les projets photovoltaïques,
     • quatre-vingt pourcents (80 %) de la Puissance indiquée dans l’offre pour les projets éoliens,
     et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
-trente (30) mois à compter de la Date de désignation pour les installations photovoltaïques ; ou trente-six (36) mois à compter de la Date de désignation pour les installations éoliennes.
-deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.
Des  dérogations  au  délai  d’Achèvement  sont  toutefois  accordées dans  le  cas  ou  des  contentieux  administratifs  effectués  à  l’encontre  d’une  autorisation  administrative  nécessaire  à  la  réalisation  du  projet ont pour effet de retarder la construction de l’installation ou sa mise en service. Dans ce cas, un délai supplémentaire égal à la durée entre la date de recours initial et la date de décision ayant autorité de la chose jugée est alors accordé.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.3 et au 7.1, pour la mise en service peuvent être accordés par le Préfet, à  son  appréciation,  en  cas  d’événement  imprévisible  à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
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
      informationEnregistrée: true,
      changementByTechnologie: true,
      ratios: {
        pv: {
          min: 0.9,
          max: 1.4,
        },
        eolien: {
          min: 0.8,
          max: 1.4,
        },
        hydraulique: {
          min: 0.9,
          max: 1.4,
        },
      },
      paragrapheAlerte: `Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) ou par l’autorisation environnementale de l’Installation (y compris si celle-ci a été modifiée) et que la Puissance modifiée soit inférieure à la limite de puissance spécifiée au paragraphe 2.2 applicable à l’Installation.`,
    },
  },
};

export const autoconsommationMetropolePPE2: AppelOffre.AppelOffreReadModel = {
  id: 'PPE2 - Autoconsommation métropole',
  typeAppelOffre: 'autoconso',
  cycleAppelOffre: 'PPE2',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées en métropole continentale',
  shortTitle: 'PPE2 - Autoconsommation métropole',
  launchDate: 'Août 2021',
  cahiersDesChargesUrl:
    'https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-d-electricite-a-partir-d-energies-renouvelables-en-autoco3',
  // dans les faits, seulement PV pour le moment (P1 à 4), mais théoriquement possible
  multiplesTechnologies: true,
  unitePuissance: { eolien: 'MW', hydraulique: 'MW', pv: 'MWc' },
  champsSupplémentaires: { typologieInstallation: 'optionnel' },
  changement: {
    nomProjet: {},
    natureDeLExploitation: {},
    siteDeProduction: {},
    représentantLégal: {
      demande: true,
      instructionAutomatique: 'rejet',
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
      changementByTechnologie: true,
      ratios: {
        pv: {
          min: 0.9,
          max: 1.1,
        },
        eolien: {
          min: 0.8,
          max: 1.2,
        },
        hydraulique: {
          min: 0.9,
          max: 1.1,
        },
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
  modification: defaultModifications,
  délaiRéalisationEnMois: { eolien: 36, pv: 30, hydraulique: 0 },
  delaiRealisationTexte:
    'trente (30) mois pour les installations photovoltaïques ou trente-six (36) mois pour les installations éoliennes',
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: false,
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
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '2.15',
  tarifOuPrimeRetenue: 'la prime retenue',
  tarifOuPrimeRetenueAlt: 'cette prime',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  doitPouvoirChoisirCDCInitial: true,

  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.2',
      dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de retrait de l’autorisation mentionnée au 2.3 par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés ;
- en cas de non obtention de toute autre autorisation administrative nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de conditions. L’accord du Ministre et les conditions imposées ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.4',
      dispositions: `Avant l’achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise :
 • entre quatre-vingt-dix pourcents (90 %) et cent-dix pourcents (110 %) de la Puissance indiquée dans l’offre pour les projets photovoltaïques;
 • entre quatre-vingt pourcents (80 %) et cent-vingt pourcents (120 %) de la Puissance indiquée dans l’offre pour les projets éoliens .
 Elles doivent faire l’objet d’une information au Préfet.
 Les modifications à la baisse, en-dessous de :
 • quatre-vingt-dix pourcents (90 %) de la Puissance indiquée dans l’offre pour les projets photovoltaïques,
 • quatre-vingt pourcents (80 %) de la Puissance indiquée dans l’offre pour les projets éoliens,
 et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
 Des modifications à la baisse, en-dessous de :
 • quatre-vingt-dix pourcents (90 %) de la Puissance indiquée dans l’offre pour les projets photovoltaïques,
 • quatre-vingt pourcents (80 %) de la Puissance indiquée dans l’offre pour les projets éoliens,
 et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `
      Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois à compter de la Date de désignation pour les installations photovoltaïques ;
ou trente-six (36) mois à compter de la Date de désignation pour les installations éoliennes.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.
Des dérogations au délai d’Achèvement sont toutefois accordées dans le cas ou des contentieux administratifs effectués à l’encontre d’une autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder la construction de l’installation ou sa mise en service. Dans ce cas, un délai supplémentaire égal à la durée entre la date de recours initial et la date de décision ayant autorité de la chose jugée est alors accordé.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires peuvent être accordés par le Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      // Les périodes 1 à 4 ont utilisé MW pour PV
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v1',
      cahierDesCharges: {
        référence: '2021 S 176-457526',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [],
      cahiersDesChargesModifiésDisponibles: [CDCModifié30082022],
      abandonAvecRecandidature: true,
      typeImport: 'csv',
    },
    {
      id: '2',
      title: 'deuxième',
      // Les périodes 1 à 4 ont utilisé MW pour PV
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v1',
      cahierDesCharges: {
        référence: '2022 S 038 098159',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [],
      cahiersDesChargesModifiésDisponibles: [CDCModifié30082022],
      abandonAvecRecandidature: true,
      typeImport: 'csv',
    },
    {
      id: '3',
      title: 'troisième',
      // Les périodes 1 à 4 ont utilisé MW pour PV
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2022 S 150-427955',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      cahiersDesChargesModifiésDisponibles: [],
      abandonAvecRecandidature: true,
      typeImport: 'csv',
    },
    {
      id: '4',
      title: 'quatrième',
      // Les périodes 1 à 4 ont utilisé MW pour PV
      unitéPuissance: 'MW',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2023/S 176-551607',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      cahiersDesChargesModifiésDisponibles: [],
      typeImport: 'csv',
    },
    // ℹ️ penser à mettre à jour le logo pour la prochaine période
    // ℹ️ penser à retirer l'unité de puissance pour la prochaine période (utiliser celle par défaut de l'AO)
  ],
};
