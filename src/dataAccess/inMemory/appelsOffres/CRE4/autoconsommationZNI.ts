import { AppelOffre } from '@entities'

const autoconsommationZNI: AppelOffre = {
  id: 'CRE4 - Autoconsommation ZNI',
  type: 'autoconso',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées dans les zones non interconnectées.',
  shortTitle: 'CRE4 - Autoconsommation ZNI',
  launchDate: 'juin 2019',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 30,
  decoupageParTechnologie: false,
  delaiRealisationTexte: 'trente (30) mois',
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.4',
  paragrapheEngagementIPFPGPFC: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.3',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '',
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '2.10',
  tarifOuPrimeRetenue: 'la prime retenue',
  tarifOuPrimeRetenueAlt: 'cette prime',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  soumisAuxGarantiesFinancieres: 'non soumis',
  changementPuissance: {
    ratios: {
      min: 0.8,
      max: 1,
    },
  },
  choisirNouveauCahierDesCharges: true,
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.2',
      dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.4). 
Par exception, le Candidat est délié de cette obligation : 
- en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés. 
-  en  cas  de  non  obtention  ou  de  retrait  de  toute  autre  autorisation  administrative  ou  dérogation nécessaire à la réalisation du projet. 
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée. 
Le Candidat peut également être délié de cette obligation selon appréciation du ministre chargé de l’énergie  suite  à  une  demande  dûment  justifiée.  Le  Ministre  peut  accompagner  son accord  de conditions. L’accord du Ministre et les conditions imposées le cas échéant, ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
    },
    texteChangementDActionnariat: {
      référenceParagraphe: '5.3.2',
      dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois. A cette fin, le producteur transmet à la DREAL les copies des statuts de la société et le(s) justificatif(s) relatif à la composition de l’actionnariat.`,
    },
    texteIdentitéDuProducteur: {
      référenceParagraphe: '2.5',
      dispositions: `Le Candidat doit être le Producteur de l’Installation de production. Il ne peut pas indiquer dans son offre qu’une autre société sera le Producteur de l’Installation de production au cas où le projet serait retenu.`,
    },
    texteChangementDeProducteur: {
      référenceParagraphe: '5.3.1',
      dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur puisse justifier qu’il a déposé sa demande de raccordement dans les deux (2) mois suivant la Date de désignation et mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit intervenir dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T.`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2019/S 113-276257',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/AUTOCONSO-ZNI-Telecharger-le-cahier-des-charges-publie-le-12-07-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ou après l’Achèvement ne sont pas autorisées.`,
        },
      },
    },
    {
      id: '2',
      title: 'deuxième',
      certificateTemplate: 'cre4.v1',
      noteThreshold: 32.9,
      cahierDesCharges: {
        reference: '2019/S 113-276257',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/zni-autoconso-telecharger-le-cahier-des-charges-publie-le-09-06-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90 %) et cent-dix pourcents (110 %) de la Puissance indiquée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
Les modifications de la Puissance installée hors de cette fourchette ou les modifications à la hausse de la Puissance installée après l’Achèvement ne sont pas autorisées.
Par dérogation, les modifications à la baisse de la Puissance installée qui seraient imposées soit par une décision de l’Etat dans le cadre de la procédure d’autorisation mentionnée au 3.3.3 pour la première période de candidature, ou par une décision de justice concernant l’autorisation mentionnée au 3.3.3 pour l’ensemble des périodes de candidature, sont acceptées. Elles doivent faire l’objet d’une information au Préfet.`,
        },
      },
    },
  ],
  familles: [],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/07/2021',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/30072021-avis-modificatif-cre4-zni-autoconsommation-2',
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80%) et cent pourcents (100%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
 Des modifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
        },
      },
      changementPuissance: {
        ratios: {
          min: 0.8,
          max: 1,
        },
      },
    },
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre-4-zni-autoconsommation-2-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance  de  l’Installation  modifiée  soit  comprise  entre  quatre-vingt  pourcents  (80%)  et  cent  pourcents (100%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
    Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre,  à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation ( y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit inférieure à la limite de puissance mentionnée au 2.2.
    Les modifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
    Des modifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée.`,
        },
      },
      changementPuissance: {
        ratios: {
          min: 0.9,
          max: 1.4,
        },
      },
    },
  ],
}

export { autoconsommationZNI }
