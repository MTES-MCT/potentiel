import { AppelOffre } from '@potentiel-domain/appel-offre';

const CDCModifié30072021: AppelOffre.CahierDesChargesModifié = {
  paruLe: '30/07/2021',
  type: 'modifié',
  donnéesCourriersRéponse: {
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.4',
      dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80%) et cent pourcents (100%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
 Des modifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
    },
  },
  changement: {
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
        max: 1,
      },
    },
    recours: {
      demande: true,
    },
    achèvement: {
      informationEnregistrée: true,
    },
    abandon: {
      demande: true,
      autoritéCompétente: 'dgec',
    },
  },
};

export const autoconsommationMetropole2016: AppelOffre.AppelOffreReadModel = {
  id: 'CRE4 - Autoconsommation métropole 2016',
  typeAppelOffre: 'autoconso',
  cycleAppelOffre: 'CRE4',
  title:
    'portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir d’énergies renouvelables en autoconsommation',
  shortTitle: 'CRE4 - Autoconsommation métropole 2016',
  launchDate: 'juillet 2016',
  cahiersDesChargesUrl:
    'https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-d-electricite-a-partir-d-energies-renouvelables-en-autoco',
  technologie: 'pv',
  unitePuissance: 'MWc',
  changement: 'indisponible',
  délaiRéalisationEnMois: 30,
  delaiRealisationTexte: 'trente (30) mois',
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '3.2.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiEngagementIPFPGPFC: '3.2.6 et 7.2.2',
  paragrapheClauseCompetitivite: '',
  tarifOuPrimeRetenue: 'la prime retenue',
  tarifOuPrimeRetenueAlt: 'cette prime',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  garantiesFinancières: {
    soumisAuxGarantiesFinancieres: 'non soumis',
    renvoiRetraitDesignationGarantieFinancieres: '',
    typeGarantiesFinancièresDisponibles: [
      'consignation',
      'avec-date-échéance',
      'six-mois-après-achèvement',
      'type-inconnu',
    ],
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
Le Candidat peut également être délié de cette obligation selon appréciation du ministre chargé de l’énergie  suite  à  une  demande  dûment  justifiée.  Le  Ministre  peut  accompagner  son accord  de conditions. L’accord du Ministre et les conditions imposées le cas échéant, ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.4',
      dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ou après l’Achèvement ne sont pas autorisées.`,
    },
    texteChangementDActionnariat: {
      référenceParagraphe: '5.2.2',
      dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.2',
      dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T. Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 146-264282',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [],
      cahiersDesChargesModifiésDisponibles: [CDCModifié30072021],
      abandonAvecRecandidature: true,
    },
    {
      id: '2',
      title: 'deuxième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 146-264282',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      familles: [],
      cahiersDesChargesModifiésDisponibles: [CDCModifié30072021],
      abandonAvecRecandidature: true,
    },
  ],
};
