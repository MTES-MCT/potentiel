import { AppelOffre } from '@entities'

const garantieFinanciereEnMois = 36

const zni: AppelOffre = {
  id: 'CRE4 - ZNI',
  type: 'zni',
  title:
    'portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir de l’énergie solaire et situées dans les zones non interconnectées',
  shortTitle: 'CRE4 - ZNI',
  launchDate: 'juin 2019',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  decoupageParTechnologie: false,
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  paragraphePrixReference: '7.1',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFPGPFC: '3.3.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.2 et 6.2',
  renvoiEngagementIPFPGPFC: '3.3.6 et 7.1',
  paragrapheClauseCompetitivite: '2.8',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: true,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  renvoiSoumisAuxGarantiesFinancieres: `doit être au minimum de ${garantieFinanciereEnMois} mois`,
  changementPuissance: {
    ratios: {
      min: 0.9,
      max: 1.1,
    },
  },
  choisirNouveauCahierDesCharges: true,
  texteCDCCourriers: {
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
    texteIdentitéDuProducteur: {
      référenceParagraphe: '2.5',
      dispositions: `Le Candidat doit être le Producteur de l’Installation de production. Il ne peut pas indiquer dans son offre qu’une autre société sera le Producteur de l’Installation de production au cas où le projet serait retenu.`,
    },
    texteChangementDeProducteur: {
      référenceParagraphe: '5.4.1',
      dispositions: `Les changements de Producteur avant constitution des garanties financières prévues au 6.2 ne sont pas autorisés. 
Les changements de Producteur après constitution des garanties financières prévues au 6.2 sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société ainsi que les nouvelles garanties financières prévues au 6.2.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.4',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- 24 mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        reference: '2019/S 113-276264',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/AO-ZNI-solaire',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1a', territoire: 'Corse', noteThreshold: 53.4 },
        { familleId: '1a', territoire: 'Guadeloupe', noteThreshold: 56.3 },
        { familleId: '1a', territoire: 'La Réunion', noteThreshold: 30.6 },
        { familleId: '1a', territoire: 'Mayotte', noteThreshold: 34.5 },
        //
        { familleId: '1b', territoire: 'Corse', noteThreshold: 47.2 },
        { familleId: '1b', territoire: 'Guadeloupe', noteThreshold: 54.2 },
        { familleId: '1b', territoire: 'La Réunion', noteThreshold: 61.9 },
        { familleId: '1b', territoire: 'Mayotte', noteThreshold: 13.1 },
        //
        { familleId: '1c', territoire: 'Corse', noteThreshold: 58.2 },
        { familleId: '1c', territoire: 'Guadeloupe', noteThreshold: 77.1 },
        { familleId: '1c', territoire: 'Guyane', noteThreshold: 64.1 },
        { familleId: '1c', territoire: 'La Réunion', noteThreshold: 65.7 },
        { familleId: '1c', territoire: 'Martinique', noteThreshold: 75.9 },
        { familleId: '1c', territoire: 'Mayotte', noteThreshold: 19.6 },
      ],
    },
    {
      id: '2',
      title: 'deuxième',
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        reference: '2019/S 113-276264',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/AO-ZNI-solaire',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '2a', territoire: 'Corse', noteThreshold: 42.1 },
        { familleId: '2a', territoire: 'Guadeloupe', noteThreshold: 47.2 },
        { familleId: '2a', territoire: 'Guyane', noteThreshold: 18.4 },
        { familleId: '2a', territoire: 'La Réunion', noteThreshold: 33.3 },
        { familleId: '2a', territoire: 'Mayotte', noteThreshold: 16 },
        //
        { familleId: '2b', territoire: 'Guadeloupe', noteThreshold: 41.7 },
        { familleId: '2b', territoire: 'Guyane', noteThreshold: 42.4 },
        { familleId: '2b', territoire: 'La Réunion', noteThreshold: 14.3 },
        { familleId: '2b', territoire: 'Mayotte', noteThreshold: 24.1 },
        //
        { familleId: '2c', territoire: 'Guadeloupe', noteThreshold: 70.4 },
        { familleId: '2c', territoire: 'Guyane', noteThreshold: 57.6 },
        { familleId: '2c', territoire: 'La Réunion', noteThreshold: 17.1 },
        { familleId: '2c', territoire: 'Martinique', noteThreshold: 27.2 },
      ],
    },
    {
      id: '3',
      title: 'troisième',
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2019/S 113-276264',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/zni-sol-telecharger-le-cahier-des-charges-publie-le-09-06-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1a', territoire: 'Corse', noteThreshold: 52.7 },
        { familleId: '1a', territoire: 'Guadeloupe', noteThreshold: 30.6 },
        { familleId: '1a', territoire: 'La Réunion', noteThreshold: 29.9 },
        { familleId: '1a', territoire: 'Martinique', noteThreshold: 18.6 },
        //
        { familleId: '1b', territoire: 'Corse', noteThreshold: 40.4 },
        { familleId: '1b', territoire: 'Guadeloupe', noteThreshold: 35.9 },
        { familleId: '1b', territoire: 'La Réunion', noteThreshold: 42.9 },
        { familleId: '1b', territoire: 'Martinique', noteThreshold: 35.9 },
        //
        { familleId: '1c', territoire: 'Corse', noteThreshold: 80.7 },
        { familleId: '1c', territoire: 'Guadeloupe', noteThreshold: 64.1 },
        { familleId: '1c', territoire: 'La Réunion', noteThreshold: 33.7 },
      ],
    },
    {
      id: '4',
      title: 'quatrième',
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2019/S 113-276264',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-publie-le-12-10-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '2a', territoire: 'Corse', noteThreshold: 33.61 },
        { familleId: '2a', territoire: 'Guadeloupe', noteThreshold: 40.48 },
        { familleId: '2a', territoire: 'Guyane', noteThreshold: 30.53 },
        { familleId: '2a', territoire: 'La Réunion', noteThreshold: 41.78 },
        { familleId: '2a', territoire: 'Martinique', noteThreshold: 29.9 },
        { familleId: '2a', territoire: 'Mayotte', noteThreshold: 22.65 },
        //
        { familleId: '2b', territoire: 'Corse', noteThreshold: 32.15 },
        { familleId: '2b', territoire: 'Guyane', noteThreshold: 31.64 },
        { familleId: '2b', territoire: 'La Réunion', noteThreshold: 23.48 },
        { familleId: '2b', territoire: 'Martinique', noteThreshold: 25.94 },
        //
        { familleId: '2c', territoire: 'Guadeloupe', noteThreshold: 44.64 },
        { familleId: '2c', territoire: 'Guyane', noteThreshold: 62.19 },
        { familleId: '2c', territoire: 'La Réunion', noteThreshold: 19.93 },
      ],
    },
    {
      id: '5',
      title: 'cinquième',
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2019/S 113-276264',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-publie-le-12-10-2020',
      },
      noteThresholdBy: 'family',
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      noteThreshold: [
        { familleId: '1a', territoire: 'Mayotte', noteThreshold: 49.99 },
        { familleId: '1a', territoire: 'Guyane', noteThreshold: 30.64 },
        //
        { familleId: '1b', territoire: 'Mayotte', noteThreshold: 55.62 },
        { familleId: '1b', territoire: 'Guyane', noteThreshold: 34.59 },
        //
        { familleId: '1c', territoire: 'Mayotte', noteThreshold: 21.4 },
        { familleId: '1c', territoire: 'Guyane', noteThreshold: 65.52 },
      ],
    },
  ],
  familles: [
    // 2017 ZNI avec stockage
    {
      id: '1',
      title: '1. 100kWc - 250kWc',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    {
      id: '2',
      title: '2. 250kWc - 1,5MWc',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    {
      id: '3',
      title: '3. 250kWc - 5MWc',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    // 2019 ZNI avec stockage
    {
      id: '1a',
      title: '1a. 100kWc - 500 kWc',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    {
      id: '1b',
      title: '1b. 500 kWc - 1,5MWc',
      garantieFinanciereEnMois,
      soumisAuxGarantiesFinancieres: 'après candidature',
    },
    {
      id: '1c',
      title: '1c. 500 kWc - 5 MWc',
      garantieFinanciereEnMois,
      soumisAuxGarantiesFinancieres: 'après candidature',
    },
    // 2019 ZNI sans stockage
    {
      id: '2a',
      title: '2a. 100kWc - 500 kWc',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    {
      id: '2b',
      title: '2b. 500 kWc - 1,5MWc',
      garantieFinanciereEnMois,
      soumisAuxGarantiesFinancieres: 'après candidature',
    },
    {
      id: '2c',
      title: '2c. 500 kWc - 5 MWc',
      garantieFinanciereEnMois,
      soumisAuxGarantiesFinancieres: 'après candidature',
    },
  ],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/07/2021',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/30072021-avis-modificatif-cre4-zni-2',
      texteCDCCourriers: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.4.4',
          dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
 Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
        },
      },
    },
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre-4-zni-2-2022-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      texteCDCCourriers: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.4.4',
          dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
    Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre,  à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation ( y compris si celle-ci a été modifiée)   et  que  la  Puissance  modifiée  soit  i  nférieure  au  plafond  de  puissance  de  la  famille  dans  laquelle entre l’offre.
    Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
    Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée.`,
        },
      },
    },
    {
      paruLe: '30/08/2022',
      alternatif: true,
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre-4-zni-2-bis-2022-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      texteCDCCourriers: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.4.4',
          dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre, à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) et que la Puissance modifiée soit inférieure au plafond de puissance de la famille dans laquelle entre l’offre.Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
        },
      },
    },
  ],
}

export { zni }
