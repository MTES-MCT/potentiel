import { AppelOffre } from '@entities'

const neutrePPE2: AppelOffre = {
  id: 'PPE2 - Neutre',
  type: 'neutre',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergie solaire photovoltaïque, hydroélectrique ou éolienne situées en métropole continentale',
  shortTitle: 'PPE2 - Neutre',
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
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
  changementPuissance: {
    ratios: {
      min: 0.8,
      max: 1.2,
    },
  },
  engagementRéalisationEtModalitésAbandon: {
    référenceParagraphe: '6.2',
    dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
˗ en cas de retrait de l’autorisation par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
˗ en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de
conditions ou du prélèvement d’une part de la garantie financière. L’accord du Ministre, les conditions imposées et le prélèvement de la garantie financière ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
  },
  changementDePuissance: {
    référenceParagraphe: '5.2.5',
    dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingtspourcents (80 %) et cent-vingt pourcents (120 %) de la Puissance indiquée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Lesmodifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.Des modifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.Après l'achèvement, les modifications à la hausse ne sont pas acceptées.`,
  },
  délaisDAchèvement: {
    référenceParagraphe: '6.3',
    dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois à compter de la Date de désignation pour les installations photovoltaïques ;
ou trente-six (36) mois à compter de la Date de désignation pour les installations éoliennes ou hydroélectriques.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.`,
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      type: 'not-yet-notified',
      certificateTemplate: 'ppe2.v1',
      cahierDesCharges: {
        référence: '2021 S 176-457521',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-neutre-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
    },
    // Pour les prochaines periodes utiliser le certificateTemplate ppe2.v2
  ],
  familles: [
    // seulement sur les installations hydrauliques
    {
      id: '1',
      title:
        'installations implantées sur de nouveaux sites, de puissance installée supérieure ou égale à 1 MW ',
      soumisAuxGarantiesFinancieres: 'à la candidature',
    },
    {
      id: '2',
      title:
        'installations équipant des sites existants, de puissance installée supérieure ou égale à 1 MW',
      soumisAuxGarantiesFinancieres: 'à la candidature',
    },
  ],
  cahiersDesChargesModifiésDisponibles: [],
}

export { neutrePPE2 }
