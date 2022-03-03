import { AppelOffre } from '@entities'

const neutrePPE2: AppelOffre = {
  id: 'PPE2 - Neutre',
  type: 'neutre',
  title:
    '2021 S 176-457521 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergie solaire photovoltaïque, hydroélectrique ou éolienne situées en métropole continentale',
  shortTitle: 'PPE2 - Neutre 2021 S 176-457521',
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
  soumisAuxGarantiesFinancieres: true,
  paragrapheDelaiDerogatoire: '6.3',
  delaiRealisationEnMoisParTechnologie: { eolien: 36, pv: 30, hydraulique: 36 },
  decoupageParTechnologie: true,
  contenuParagrapheAchevement: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente (30) mois pour les installations photovoltaïques ou trente-six (36) mois pour les installations éoliennes ou hydroélectriques à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur puisse justifier qu’il a déposé sa demande de raccordement dans les deux (2) mois suivant la Date de désignation et mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit intervenir dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date d’envoi par le gestionnaire de réseau compétent de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.`,
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
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.3',
      type: 'not-yet-notified',
      certificateTemplate: 'ppe2.v1',
    },
  ],
  familles: [
    // seulement sur les installations hydrauliques
    {
      id: '1',
      title:
        'installations implantées sur de nouveaux sites, de puissance installée supérieure ou égale à 1 MW ',
    },
    {
      id: '2',
      title:
        'installations équipant des sites existants, de puissance installée supérieure ou égale à 1 MW',
    },
  ],
}

export { neutrePPE2 }
