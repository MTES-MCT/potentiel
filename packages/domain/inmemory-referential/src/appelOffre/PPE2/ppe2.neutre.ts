import { AppelOffre } from '@potentiel-domain/appel-offre';
import { validateurParDéfaut } from '../../validateurParDéfaut';

export const neutrePPE2: AppelOffre = {
  id: 'PPE2 - Neutre',
  typeAppelOffre: 'neutre',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergie solaire photovoltaïque, hydroélectrique ou éolienne situées en métropole continentale',
  shortTitle: 'PPE2 - Neutre',
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  launchDate: 'Août 2021',
  cahiersDesChargesUrl:
    'https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-d-electricite-a-partir-d-energie-solaire-photovoltaique',
  unitePuissance: 'MW',
  autoritéCompétenteDemandesDélai: 'dreal',
  tarifOuPrimeRetenue: 'le prix de référence T de l’électricité retenu',
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  paragraphePrixReference: '7',
  affichageParagrapheECS: false,
  paragrapheEngagementIPFPGPFC: '3.3.8, 4.6 et 6.6.2',
  renvoiEngagementIPFPGPFC: '3.3.8',
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.1',
  paragrapheDelaiDerogatoire: '6.3',
  delaiRealisationEnMoisParTechnologie: { eolien: 36, pv: 30, hydraulique: 36 },
  decoupageParTechnologie: true,
  delaiRealisationTexte:
    'trente (30) mois pour les installations photovoltaïques ou trente-six (36) mois pour les installations éoliennes ou hydroélectriques',
  paragrapheAttestationConformite: '6.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  paragrapheClauseCompetitivite: '2.14',
  afficherPhraseRegionImplantation: false,
  afficherValeurEvaluationCarbone: true,
  soumisAuxGarantiesFinancieres: 'à la candidature',
  changementPuissance: {
    ratios: {
      min: 0.8,
      max: 1.2,
    },
  },
  changementProducteurPossibleAvantAchèvement: true,
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.2',
      dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
˗ en cas de retrait de l’autorisation par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
˗ en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de
conditions ou du prélèvement d’une part de la garantie financière. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.5',
      dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingtspourcents (80 %) et cent-vingt pourcents (120 %) de la Puissance indiquée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Lesmodifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.Des modifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.Après l'achèvement, les modifications à la hausse ne sont pas acceptées.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `
      Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois à compter de la Date de désignation pour les installations photovoltaïques ;
ou trente-six (36) mois à compter de la Date de désignation pour les installations éoliennes ou hydroélectriques.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.
      Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder la construction de l’installation ou sa mise en service. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires peuvent être accordés par le Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      type: 'notified',
      certificateTemplate: 'ppe2.v2',
      validateurParDéfaut: validateurParDéfaut.nicolas,
      noteThreshold: 26.89,
      cahierDesCharges: {
        référence: '2022 S 100-276861',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
˗ en cas de retrait de l’autorisation par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
˗ en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du Ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
      abandonAvecRecandidature: true,
    },
    {
      id: '2',
      title: 'deuxième',
      type: 'notified',
      certificateTemplate: 'ppe2.v2',
      validateurParDéfaut: validateurParDéfaut.hermine,
      noteThreshold: 26.87,
      cahierDesCharges: {
        référence: '2023 S 147-469153',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      familles: [],
      donnéesCourriersRéponse: {
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '6.2',
          dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
˗ en cas de retrait de l’autorisation par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
˗ en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du Ministre chargé de l’énergie à la suite d’une demande dûment justifiée. L’État peut toutefois prélever la totalité ou une partie de la garantie financière dans les conditions du paragraphe 5.1. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’État aux sanctions du 8.2.`,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
    },
  ],
};
