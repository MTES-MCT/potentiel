import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

export const autoconsommationZNI2017: AppelOffre = {
  id: 'CRE4 - Autoconsommation ZNI 2017',
  type: 'autoconso',
  title:
    '${referencePeriode} portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées dans les zones non interconnectées',
  shortTitle: 'CRE4 - Autoconsommation ZNI ${referencePeriode}',
  launchDate: 'décembre 2016',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 30,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(30, '7.1'),
  delaiRealisationTexte: 'trente (30) mois',
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.4',
  paragrapheEngagementIPFPGPFC: '3.2.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '',
  renvoiEngagementIPFPGPFC: '3.2.6 et 7.2.2',
  paragrapheClauseCompetitivite: '',
  tarifOuPrimeRetenue: 'la prime retenue',
  tarifOuPrimeRetenueAlt: 'cette prime',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  changementPuissance: {
    ratios: {
      min: 0.8,
      max: 1,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.3',
      type: 'legacy',
      reference: '2016/S 242-441979',
    },
  ],
  familles: [],
}
