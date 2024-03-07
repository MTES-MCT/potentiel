import { AppelOffre } from "@potentiel-domain/appel-offre";

export const biogazPPE2: AppelOffre = {
  id: "PPE2 - Biogaz",
  typeAppelOffre: "biogaz",
  title:
    "portant sur la réalisation et l’exploitation d’Installations de production de biométhane injecté dans un réseau de gaz naturel.",
  shortTitle: "PPE2 - Biogaz",
  launchDate: "février 2024 ",
  cahiersDesChargesUrl:
    "https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-de-biomethane-injecte-dans-un-reseau-de-gaz-naturel",
  unitePuissance: "GWh PCS/an",
  delaiRealisationEnMois: 30,
  autoritéCompétenteDemandesDélai: "dreal",
  decoupageParTechnologie: false,
  delaiRealisationTexte: "trente (30) mois",
  paragraphePrixReference: "7",
  paragrapheDelaiDerogatoire: "6.3",
  paragrapheAttestationConformite: "6.5",
  paragrapheEngagementIPFPGPFC: "3.2.7, 4.4 et 6.5.2",
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: "5.2",
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: "6.1",
  renvoiRetraitDesignationGarantieFinancieres: "5.1",
  soumisAuxGarantiesFinancieres: "à la candidature",
  renvoiEngagementIPFPGPFC: "3.2.7",
  paragrapheClauseCompetitivite: "2.9",
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: "ce prix de référence",
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar:
    "gaz-renouvelables-et-bas-carbone@developpement-durable.gouv.fr",
  doitPouvoirChoisirCDCInitial: true,
  changementPuissance: {
    ratios: {
      min: 0.9,
      max: 1.1,
    },
  },
  changementProducteurPossibleAvantAchèvement: true,
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: "6.2",
      dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du Candidat ne sont pas concernés.
- en cas de non obtention de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas sans délai le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de
conditions ou du prélèvement d’une part de la garantie financière. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: "5.2.4",
      dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre, dans la limite du plafond de puissance de 1 MWc spécifié au paragraphe 1.2.2 pour le cas d'une offre entrant dans le volume réservé. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
 Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.
 Après l'achèvement, les modifications à la hausse ne sont pas acceptées.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: "6.3",
      dispositions: `
      Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois à compter de la Date de désignation ;
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1.1 est réduite de la  durée de dépassement. Des dérogations au délai d’Achèvement sont toutefois accordées dans le cas où des contentieux administratifs effectués à l’encontre de l’autorisation d’urbanisme liée à l’installation ou à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’Achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date de recours initial et la date de décision ayant autorité de la chose jugée est alors accordé.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès du Cocontractant.
Des délais supplémentaires peuvent être accordés par le Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
    },
  },
  periodes: [
    {
      id: "1",
      title: "première",
      certificateTemplate: "ppe2.v2",
      cahierDesCharges: {
        référence: "2023/S 249-790242",
      },
      delaiDcrEnMois: { valeur: 3, texte: "trois" },
      noteThresholdBy: "category",
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 11,
          puissanceMax: 50,
        },
        autres: {
          noteThreshold: 99,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
    },
  ],
  familles: [],
};
