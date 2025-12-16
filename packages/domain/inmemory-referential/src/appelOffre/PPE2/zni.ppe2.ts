import { AppelOffre } from '@potentiel-domain/appel-offre';

export const zniPPE2: AppelOffre.AppelOffreReadModel = {
  id: 'PPE2 - ZNI',
  typeAppelOffre: 'zni',
  cycleAppelOffre: 'PPE2',
  title: `portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir de l’énergie solaire et situées dans les zones non interconnectées`,
  shortTitle: 'PPE2 - ZNI',
  launchDate: 'Décembre 2023',
  cahiersDesChargesUrl: `https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-d-electricite-a-partir-de-l-energie-solaire-et-situees-da`,
  technologie: 'pv',
  unitePuissance: 'MWc',
  délaiRéalisationEnMois: 30,
  delaiRealisationTexte: 'trente (30) mois',
  changement: {
    nomProjet: {},
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
    installateur: {},
    dispositifDeStockage: {},
  },
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '3.2.7, 4.5 et 6.5.1',
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
      dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2). Par exception, le Candidat est délié de cette obligation : 39/84 
      - en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés ; 
      - en cas de non obtention ou de retrait de toute autre autorisation administrative nécessaire à la réalisation du projet. Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée. Le Candidat peut également être délié de cette obligation selon appréciation du ministre chargé de l’énergie suite à une demande dûment justifiée. L’Etat peut toutefois prélever la totalité ou une part de la garantie financière selon les dispositions du 5.1 L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent la possibilité de recours de l’Etat aux sanctions du 8.2.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.3',
      dispositions: `Avant l’achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet. Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée. Après l'achèvement, les modifications à la hausse ne sont pas acceptées.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes : 
      - trente (30) mois à compter de la Date de désignation ; 
      - deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date d’envoi par le gestionnaire de réseau compétent de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement. En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1.1  est réduite de la durée de dépassement.
      Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de l’autorisation d’urbanisme liée à l’installation ou à l’encontre de toute autre autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder la construction de l’installation ou sa mise en service. Dans ce cas, un délai supplémentaire égal à la durée de traitement des contentieux est alors accordé. Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, peuvent être accordés par le Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
    },
    texteChangementDActionnariat: {
      référenceParagraphe: '5.2.2',
      dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois. Si le Candidat s’est engagé au Financement Collectif ou à la Gouvernance Partagée du projet prévu au 3.2.7, il est de sa responsabilité́ de s’assurer du respect de son engagement.`,
    },
  },
  champsSupplémentaires: { typologieInstallation: 'optionnel' },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'ppe2.v2',
      logo: 'MEFSIN',
      cahierDesCharges: {
        référence: '2023/S 183-570186',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [
        {
          id: '1',
          title: `Installations sur bâtiments, hangars, ombrières, ombrières agrivoltaïques et serres agrivoltaïques, de puissance strictement supérieure à 500 kWc`,
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'à la candidature' },
        },
        {
          id: '2',
          title: `Installations au sol, de puissance strictement supérieure à 500 kWc et inférieure
ou égale à 12 MWc pour les projets sur terrains correspondant aux cas 1 et 2 du paragraphe
2.6 et strictement supérieure à 500 kWc pour les projets sur terrains correspondant au cas 3
du paragraphe 2.6.`,
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'à la candidature' },
        },
      ],
      cahiersDesChargesModifiésDisponibles: [],
      typeImport: 'csv',
    },
    {
      id: '2',
      title: 'seconde',
      certificateTemplate: 'ppe2.v2',
      logo: 'MCE',
      cahierDesCharges: {
        référence: '2024/S 490218-2024',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [
        {
          id: '1',
          title: `Installations sur bâtiments, ombrières, ombrières agrivoltaïques et serres agrivoltaïques au sens du paragraphe 1.4, de puissance strictement supérieure à 500 kWc.`,
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'à la candidature' },
        },
        {
          id: '2',
          title: `Installations au sol de puissance strictement supérieure à 500 kWc et inférieure
ou égale à 12 MWc pour les projets sur terrains correspondant aux cas 1 et 2 du paragraphe
2.6 et strictement supérieure à 500 kWc pour les projets sur terrains correspondant en totalité au cas 3
du paragraphe 2.6.`,
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'à la candidature' },
        },
      ],
      cahiersDesChargesModifiésDisponibles: [],
      typeImport: 'csv',
    },
    {
      id: '3',
      title: 'troisème',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '2023/S 183-570186',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [
        {
          id: '1',
          title: `Installations sur bâtiments, ombrières, ombrières agrivoltaïques et serres agrivoltaïques au sens du paragraphe 1.4, de puissance strictement supérieure à 500 kWc.`,
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'à la candidature' },
        },
        {
          id: '2',
          title: `Installations au sol de puissance strictement supérieure à 500 kWc et inférieure
ou égale à 12 MWc pour les projets sur terrains correspondant aux cas 1 et 2 du paragraphe
2.6 et strictement supérieure à 500 kWc pour les projets sur terrains correspondant en totalité au cas 3
du paragraphe 2.6.`,
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'à la candidature' },
        },
      ],
      cahiersDesChargesModifiésDisponibles: [],
      typeImport: 'csv',
    },
    {
      id: '4',
      title: 'quatrième',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '2025/S 146-503744',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [
        {
          id: '1',
          title: `Installations sur bâtiments, ombrières, ombrières agrivoltaïques et serres agrivoltaïques au sens du paragraphe 1.4, de puissance strictement supérieure à 500 kWc.`,
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'à la candidature' },
        },
        {
          id: '2',
          title: `Installations au sol : de puissance strictement supérieure à 500 kWc et inférieure ou égale à 12 MWc pour les projets sur terrains correspondant aux cas 1 et 2 du paragraphe 2.5, de puissance strictement supérieure à 500 kWc et inférieure ou égale à 12 MWc pour les projets sur terrains correspondant au cas 2 bis du paragraphe 2.5 en Guadeloupe, en Guyane et à La Réunion uniquement ; et de puissance strictement supérieure à 500 kWc pour les projets sur terrains correspondant en totalité au cas 3 du paragraphe 2.5.`,
          garantiesFinancières: { soumisAuxGarantiesFinancieres: 'à la candidature' },
        },
      ],
      cahiersDesChargesModifiésDisponibles: [],
      typeImport: 'csv',
      champsSupplémentaires: {
        coefficientKChoisi: 'requis',
      },
    },
  ],
};
