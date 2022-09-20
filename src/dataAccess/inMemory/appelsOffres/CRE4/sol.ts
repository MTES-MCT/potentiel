import { AppelOffre } from '@entities'

const garantieFinanciereEnMois = 42

const sol: AppelOffre = {
  id: 'CRE4 - Sol',
  type: 'sol',
  title:
    'portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir de l’énergie solaire « Centrale au sol »',
  shortTitle: 'CRE4 - Sol',
  launchDate: 'août 2016',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  decoupageParTechnologie: false,
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFPGPFC: '3.2.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.3 et 6.2',
  renvoiEngagementIPFPGPFC: '3.2.6 et 7.2.2',
  paragrapheClauseCompetitivite: '2.8',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  renvoiSoumisAuxGarantiesFinancieres: `doit être au minimum de ${garantieFinanciereEnMois} mois`,
  changementPuissance: {
    ratios: {
      min: 0.9,
      max: 1.1,
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
Le Candidat peut également être délié de cette obligation selon appréciation du ministre chargé de l’énergie  suite  à  une  demande  dûment  justifiée.  Le  Ministre  peut  accompagner  son accord  de conditions. L’accord du Ministre et les conditions imposées le cas échéant, ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
  },
  changementDePuissance: {
    référenceParagraphe: '5.4.4',
    dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-quinze pourcents et cent pourcents de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.`,
  },
  changementDActionnariat: {
    référenceParagraphe: '5.4.2',
    dispositions: `Les modifications de la structure du capital du Candidat avant constitution des garanties financières prévues au 6.2 ne sont pas autorisées. 
Les modifications de la structure du capital du Candidat après constitution des garanties financières prévues au 6.2 sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois. A cette fin, le producteur transmet à la DREAL les copies des statuts de la société et le(s) justificatif(s) relatif à la composition de l’actionnariat. 
Si le candidat a joint à son offre la lettre d’engagement du 3.2.6, il est de sa responsabilité de s’assurer du respect de son engagement.`,
  },
  identitéDuProducteur: {
    référenceParagraphe: '2.5',
    dispositions: `Le Candidat doit être le Producteur de l’Installation de production. Il ne peut pas indiquer dans son offre qu’une autre société sera le Producteur de l’Installation de production au cas où le projet serait retenu.`,
  },
  changementDeProducteur: {
    référenceParReagraphe: '5.4.1',
    dispositions: `Les changements de Producteur avant constitution des garanties financières prévues au 6.2 ne sont pas autorisés. 
Les changements de Producteur après constitution des garanties financières prévues au 6.2 sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société ainsi que les nouvelles garanties financières prévues au 6.2. `,
  },
  délaisDAchèvement: {
    référenceParagraphe: '6.4',
    dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- 24 mois à compter de la Date de désignation.
!!!!!OPTION : PERIODES 1 à 3!!!!! - deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat de rémunération mentionnée au 6.4 est amputée d’un raccourcissement R égal à la durée T de dépassement: R= T.
!!!!!OPTION : PERIODE 4 à 10!!!!! - deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les
travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, le prix de référence T0 proposé au C du formulaire de candidature est diminué de 0,25euros/MWh par mois de retard pendant les 6 premiers mois, puis de 0,50euros/MWh par mois de retard à partir du 7ème mois.`,
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-1ere-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '2',
      title: 'deuxième',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-2eme-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '3',
      title: 'troisième',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-3eme-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '4',
      title: 'quatrième',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-aux-4eme-et-5eme-periodes',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '5',
      title: 'cinquième',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-aux-4eme-et-5eme-periodes',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '6',
      title: 'sixième',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-4-avril-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '7',
      title: 'septième',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 56.6 },
        { familleId: '2', noteThreshold: 48.17 },
        { familleId: '3', noteThreshold: 54.15 },
      ],
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-derniere-version-modifiee-le-5-septembre-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '8',
      title: 'huitième',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 55.25 },
        { familleId: '2', noteThreshold: 52.04 },
        { familleId: '3', noteThreshold: 54.35 },
      ],
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/ao-solaire-au-sol-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-derniere-version-modifiee-le-29-octobre-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '9',
      title: 'neuvième',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 48.6 },
        { familleId: '2', noteThreshold: 45.49 },
        { familleId: '3', noteThreshold: 36.02 },
      ],
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/ao-solaire-au-sol-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-derniere-version-modifiee-le-29-octobre-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '10',
      title: 'dixième',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 46.86 },
        { familleId: '2', noteThreshold: 43.96 },
        { familleId: '3', noteThreshold: 23.94 },
      ],
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-en-vigueur-dans-sa-derniere-version-modifiee-le-12-fevrier-2021',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
  ],
  familles: [
    {
      id: '1',
      title: '1. 5 MWc – 30 Mwc',
      soumisAuxGarantiesFinancieres: 'après candidature',
      garantieFinanciereEnMois,
    },
    {
      id: '2',
      title: '2. 500kWc - 5MWc',
      soumisAuxGarantiesFinancieres: 'après candidature',
      garantieFinanciereEnMois,
    },
    {
      id: '3',
      title: '3. 500 kWc - 10MWc',
      soumisAuxGarantiesFinancieres: 'après candidature',
      garantieFinanciereEnMois,
    },
  ],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/07/2021',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/30072021-avis-modificatif-cre4-sol',
      changementDePuissance: {
        référenceParagraphe: '5.4.4',
        dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
 Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
      },
    },
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre4-sol-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      changementDePuissance: {
        référenceParagraphe: '5.4.4',
        dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31 décembre 2024, cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre,  à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation ( y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit :
- Inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant ; 
- Inférieure à la limite de puissance de 17 MWc pour les périodes 1 à 3 ou de 30 MWc pour les périodes ultérieures, si celle-ci est applicable. 
Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée.`,
      },
      délaisDAchèvement: {
        référenceParagraphe: '6.4',
        dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. 
Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
!!!!!OPTION : PERIODES 1 A 3 !!!!! En  cas  de  dépassement  de  ce  délai,  la  durée  de  contrat  de  rémunération  mentionnée  au  6.4  est  amputée d’un raccourcissement R égal à   la durée T de dépassement: R= T.
!!!!!OPTION : PERIIODES 3 a 10!!!!! En cas de dépassement de ce délai, le prix de référence T0 proposé au C du formulaire de candidature est   diminué   de   0,25euros/MWh   par   mois   de   retard   pendant   les   6   premiers   mois,   puis   de   0,50euros/MWh par mois de retard à partir du 7ème mois.`,
      },
    },
  ],
}

export { sol }
