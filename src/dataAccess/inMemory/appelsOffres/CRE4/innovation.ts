import { AppelOffre } from '@entities'

const innovation: AppelOffre = {
  id: 'CRE4 - Innovation',
  type: 'innovation',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité innovantes à partir de l’énergie solaire, sans dispositifs de stockage',
  shortTitle: 'CRE4 - Innovation',
  launchDate: 'mars 2017',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  decoupageParTechnologie: false,
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  paragraphePrixReference: '7.1',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.3',
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  changementPuissance: {
    ratios: {
      min: 0.7,
      max: 1,
    },
  },
  choisirNouveauCahierDesCharges: true,
  engagementRéalisationEtModalitésAbandon: {
    référenceParagraphe: '6.3',
    dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.4). 
Par exception, le Candidat est délié de cette obligation : 
- en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés. 
-  en  cas  de  non  obtention  ou  de  retrait  de  toute  autre  autorisation  administrative  ou  dérogation nécessaire à la réalisation du projet. 
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée. 
Le Candidat peut également être délié de cette obligation selon appréciation du ministre chargé de l’énergie  suite  à  une  demande  dûment  justifiée.  Le  Ministre  peut  accompagner  son accord  de conditions. L’accord du Ministre et les conditions imposées le cas échéant, ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.

Le Candidat dont l’offre a été retenue met en oeuvre les éléments, dispositifs et systèmes innovants décrits dans son offre (cf. 3.2.5 et 3.2.6) sur toute leur durée de vie de manière à ce que leur performance puisse être analysée sur une longue période.`,
  },
  changementDActionnariat: {
    référenceParagraphe: '5.4.2',
    dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois. A cette fin, le producteur transmet à la DREAL les copies des statuts de la société et le(s) justificatif(s) relatif à la composition de l’actionnariat. `,
  },
  identitéDuProducteur: {
    référenceParagraphe: '2.5',
    dispositions: `Le Candidat doit être le Producteur de l’Installation de production. Il ne peut pas indiquer dans son offre qu’une autre société sera le Producteur de l’Installation de production au cas où le projet serait retenu.`,
  },
  changementDeProducteur: {
    référenceParReagraphe: '5.4.1',
    dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
  },
  délaisDAchèvement: {
    référenceParagraphe: '6.3',
    dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- 24 mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.`,
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 051-094731',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-dans-sa-version-modifiee-le-5-septembre-2017',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      changementDePuissance: {
        référenceParagraphe: '5.4.5',
        dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre soixante-dix pourcents et cent pourcents de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.`,
      },
    },
    {
      id: '2',
      title: 'deuxième',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 71.58 },
        { familleId: '2', noteThreshold: 45.49 },
      ],
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        référence: '2017/S 051-094731',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-26-fevrier-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      changementDePuissance: {
        référenceParagraphe: '5.4.5',
        dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre soixante-dix pourcents et cent pourcents de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.`,
      },
    },
    {
      id: '3',
      title: 'troisième',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 64.21 },
        { familleId: '2', noteThreshold: 59.32 },
      ],
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2017/S 051-094731',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ao-innovant-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-31-mars-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      changementDePuissance: {
        référenceParagraphe: '5.4.5',
        dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-quinze pourcents et cent pourcents de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.`,
      },
    },
  ],
  familles: [
    // La période 1 a les familles 1a, 1b, 2, 3 et 4
    // Les périodes 2 et 3 ont les familles 1 et 2 seulement
    {
      id: '1a',
      title: "1a. Nouvelles conceptions d'intégration",
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    {
      id: '1b',
      title: '1b. Autres innovations de composants',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    {
      id: '3',
      title: "3. Innovation liée à l'optimisation et à l'exploitation électrique de la centrale",
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    {
      id: '4',
      title: '4. Agrivoltaïsme',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    {
      id: '1',
      title: '1. 500 kWc - 5MWc',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    {
      id: '2',
      title: '2. 100 kWc - 3MWc',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
  ],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/07/2021',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/30072021-avis-modificatif-cre4-innovation',
      changementDePuissance: {
        référenceParagraphe: '5.4.5',
        dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre soixante-dix pourcents (70%) et cent pourcents (100%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications à la baisse, en-dessous de 70% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
 Des modifications à la baisse, en-dessous de 70% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
      },
    },
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre4-innovation-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      numéroGestionnaireRequis: true,
      changementDePuissance: {
        référenceParagraphe: '5.4.5',
        dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre soixante-dix pourcents (70%) et cent pourcents (100%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
    Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre,  à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation ( y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit :
    - Inférieure au plafond de puissance de la famille dans laquelle entre l’offre ;
    - Inférieure à la limite de puissance de 3 MWc pour la période 1 ou de 5 MWc pour les périodes 2 et 3, mentionnée au 2.2.
    Les modifications à la baisse, en-dessous de 70% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
    Des modifications à la baisse, en-dessous de 70% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée. `,
      },
      délaisDAchèvement: {
        référenceParagraphe: '6.3',
        dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
* vingt-quatre (24) mois à compter de la Date de désignation.
* deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
Pour  les  installations  dont  la  mise  en  service  a  lieu  entre  le  1er  septembre  2022  et  le  31  décembre  2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.`,
      },
    },
  ],
}

export { innovation }
