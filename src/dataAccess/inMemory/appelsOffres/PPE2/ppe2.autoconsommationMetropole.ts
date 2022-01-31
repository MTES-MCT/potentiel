import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const autoconsommationMetropolePPE2: AppelOffre = {
  id: 'PPE2 - Autoconsommation métropole',
  title:
    '2021/S 146-386067 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées en métropole continentale',
  shortTitle: 'PPE2 - Autoconsommation métropole 2021/S 146-386067',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
  delaiRealisationEnMois: 30 | 36,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(30 | 36, '7.1'),
  delaiRealisationTexte:
    'trente (30) mois pour les installations photovoltaïques ou trente-six (36) mois pour les installations éoliennes',
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFP: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.1',
  soumisAuxGarantiesFinancieres: true,
  renvoiEngagementIPFP: '',
  paragrapheClauseCompetitivite: '2.15',
  tarifOuPrimeRetenue: 'la prime retenue',
  tarifOuPrimeRetenueAlt: 'cette prime',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'violaine.tarizzo@developpement-durable.gouv.fr',
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement,
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'ppe2',
    },
  ],
  familles: [],
}

export { autoconsommationMetropolePPE2 }
