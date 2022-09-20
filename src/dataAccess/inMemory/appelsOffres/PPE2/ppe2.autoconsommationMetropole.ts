import { AppelOffre } from '@entities'

const autoconsommationMetropolePPE2: AppelOffre = {
  id: 'PPE2 - Autoconsommation métropole',
  type: 'autoconso',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées en métropole continentale',
  shortTitle: 'PPE2 - Autoconsommation métropole',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
  delaiRealisationEnMoisParTechnologie: { eolien: 36, pv: 30, hydraulique: 0 },
  decoupageParTechnologie: true,
  contenuParagrapheAchevement: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois pour les installations photovoltaïques ou trente-six (36) mois pour les installations éoliennes à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur puisse justifier qu’il a déposé sa demande de raccordement dans les deux (2) mois suivant la Date de désignation et mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit intervenir dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date d’envoi par le gestionnaire de réseau compétent de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.`,
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
  renvoiRetraitDesignationGarantieFinancieres: '5.1',
  soumisAuxGarantiesFinancieres: 'à la candidature',
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '2.15',
  tarifOuPrimeRetenue: 'la prime retenue',
  tarifOuPrimeRetenueAlt: 'cette prime',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'violaine.tarizzo@developpement-durable.gouv.fr',
  changementPuissance: {
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
  engagementRéalisationEtModalitésAbandon: {
    référenceParagraphe: '6.2',
    dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de retrait de l’autorisation mentionnée au 2.3 par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés ;
- en cas de non obtention de toute autre autorisation administrative nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de conditions. L’accord du Ministre et les conditions imposées ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
  },
  changementDePuissance: {
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
  délaisDAchèvement: {
    référenceParagraphe: '6.3',
    dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois à compter de la Date de désignation pour les installations photovoltaïques ;
ou trente-six (36) mois à compter de la Date de désignation pour les installations éoliennes.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.`,
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'ppe2.v1',
      noteThreshold: 62.5,
      cahierDesCharges: {
        référence: '2021 S 176-457526',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-autoconsommation-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '2',
      title: 'deuxième',
      certificateTemplate: 'ppe2.v1',
      noteThreshold: 66.95,
      cahierDesCharges: {
        référence: '2022 S 038 098159',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-autoconsommation-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    // Pour les prochaines periodes utiliser le certificateTemplate ppe2.v2
    // A partir de la période 3 le délai DCR passe à trois mois
  ],
  familles: [],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ppe2-auto-2022-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      numéroGestionnaireRequis: true,
      changementDePuissance: {
        référenceParagraphe: '5.2.4',
        dispositions: `Avant  l’achèvement,  les  modifications  de  la  Puissance  installée  sont  autorisées,  sous  réserve  que  la  Puissance de l’Installation modifiée soit comprise :
    •entre quatre-vingt-dix pourcents (90 %) et cent-dix pourcents (110 %) de la Puissance indiquée dans l’offre pour les projets photovoltaïques;
    •entre quatre-vingt pourcents (80 %) et cent-vingt pourcents (120 %) de la Puissance indiquée dans l’offre pour les projets éoliens .
    Elles doivent faire l’objet d’une information au Préfet.
    Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre  à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation ( y compris si celle-ci a été modifiée) ou par l’autorisation environnementale de l’Installation ( y compris si celle-ci a été modifiée) et  que  la  Puissance  modifiée  soit inférieure  à  la  limite  de  puissance  spécifiée  au  paragraphe  2.2  applicable à l’Installation.
    Les modifications à la baisse, en-dessous de :
     • quatre-vingt-dix pourcents (90 %) de la Puissance indiquée dans l’offre pour les projets photovoltaïques,
     • quatre-vingt pourcents (80 %) de la Puissance indiquée dans l’offre pour les projets éoliens,
     et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
     Des modifications à la baisse, en-dessous de :
     • quatre-vingt-dix pourcents (90 %) de la Puissance indiquée dans l’offre pour les projets photovoltaïques,
     • quatre-vingt pourcents (80 %) de la Puissance indiquée dans l’offre pour les projets éoliens,
     et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
      },
      délaisDAchèvement: {
        référenceParagraphe: '6.3',
        dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -trente (30) mois à compter de la Date de désignation pour les installations photovoltaïques ; ou trente-six (36) mois à compter de la Date de désignation pour les installations éoliennes.
    -deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.`,
      },
    },
  ],
}

export { autoconsommationMetropolePPE2 }
