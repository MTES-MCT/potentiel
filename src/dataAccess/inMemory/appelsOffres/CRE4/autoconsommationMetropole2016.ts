import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

export const autoconsommationMetropole2016: AppelOffre = {
  id: 'CRE4 - Autoconsommation métropole 2016',
  type: 'autoconso',
  title:
    '2016/S 146-264282 portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir d’énergies renouvelables en autoconsommation',
  shortTitle: 'CRE4 - Autoconsommation métropole 2016/S 146-264282',
  launchDate: 'juillet 2016',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 30,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(24, '7.1'),
  delaiRealisationTexte: 'trente (30) mois',
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
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
    autoAcceptRatios: {
      min: 0.8,
      max: 1,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.4',
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.4',
    },
  ],
  familles: [],
}
