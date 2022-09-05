import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const autoconsommationZNI: AppelOffre = {
  id: 'CRE4 - Autoconsommation ZNI',
  type: 'autoconso',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées dans les zones non interconnectées.',
  shortTitle: 'CRE4 - Autoconsommation ZNI',
  launchDate: 'juin 2019',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 30,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(30, '7.1'),
  delaiRealisationTexte: 'trente (30) mois',
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.4',
  paragrapheEngagementIPFPGPFC: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.3',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '',
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '2.10',
  tarifOuPrimeRetenue: 'la prime retenue',
  tarifOuPrimeRetenueAlt: 'cette prime',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  soumisAuxGarantiesFinancieres: false,
  changementPuissance: {
    ratios: {
      min: 0.8,
      max: 1,
    },
  },
  choisirNouveauCahierDesCharges: true,
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.3',
      type: 'legacy',
      reference: '2019/S 113-276257',
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '2',
      title: 'deuxième',
      certificateTemplate: 'cre4.v1',
      paragrapheAchevement: '6.3',
      noteThreshold: 32.9,
      reference: '2019/S 113-276257',
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
  ],
  familles: [],
}

export { autoconsommationZNI }
