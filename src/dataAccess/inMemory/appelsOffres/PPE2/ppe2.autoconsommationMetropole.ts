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
  soumisAuxGarantiesFinancieres: true,
  garantiesFinancieresDeposeesALaCandidature: true,
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '2.15',
  tarifOuPrimeRetenue: 'la prime retenue',
  tarifOuPrimeRetenueAlt: 'cette prime',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'violaine.tarizzo@developpement-durable.gouv.fr',
  delaiDcrEnMois: { valeur: 3, texte: 'trois' },
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
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.3',
      certificateTemplate: 'ppe2.v1',
      noteThreshold: 62.5,
      reference: '2021 S 176-457526',
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.3',
      certificateTemplate: 'ppe2.v1',
      noteThreshold: 66.95,
      reference: '2022 S 038 098159',
    },
  ],
  familles: [],
}

export { autoconsommationMetropolePPE2 }
