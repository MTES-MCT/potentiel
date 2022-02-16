import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const autoconsommationMetropole: AppelOffre = {
  id: 'CRE4 - Autoconsommation métropole',
  type: 'autoconso',
  title:
    '2017/S 054-100223 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées en métropole continentale',
  shortTitle: 'CRE4 - Autoconsommation métropole 2017/S 054-100223',
  launchDate: 'mars 2017',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(24, '7.1'),
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  decoupageParTechnologie: false,
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
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
    {
      id: '3',
      title: 'troisième',
      paragrapheAchevement: '6.4',
    },
    {
      id: '4',
      title: 'quatrième',
      paragrapheAchevement: '6.3',
    },
    {
      id: '5',
      title: 'cinquième',
      paragrapheAchevement: '6.3',
    },
    {
      id: '6',
      title: 'sixième',
      paragrapheAchevement: '6.3',
    },
    {
      id: '7',
      title: 'septième',
      paragrapheAchevement: '6.3',
      noteThreshold: 20.04,
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'cre4.v0',
    },
    {
      id: '8',
      title: 'huitième',
      paragrapheAchevement: '6.3',
      noteThreshold: 32.04,
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'cre4.v1',
    },
    {
      id: '9',
      title: 'neuvième',
      paragrapheAchevement: '6.3',
      noteThreshold: 9.9,
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'cre4.v1',
    },
    {
      id: '10',
      title: 'dixième',
      paragrapheAchevement: '6.3',
      noteThreshold: 44.9,
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'cre4.v1',
    },
  ],
  familles: [],
}

export { autoconsommationMetropole }
