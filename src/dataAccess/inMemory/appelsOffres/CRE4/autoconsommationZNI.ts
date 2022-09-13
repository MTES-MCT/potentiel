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
  soumisAuxGarantiesFinancieres: 'non soumis',
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
  cahiersDesChargesDisponibles: [
    {
      paruLe: 'avant le 30/07/2021',
      référence: '2019/S 113-276257',
      periodeInitiale: 1,
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/AUTOCONSO-ZNI-Telecharger-le-cahier-des-charges-publie-le-12-07-2019',
    },
    {
      paruLe: 'avant le 30/07/2021',
      référence: '2019/S 113-276257',
      periodeInitiale: 2,
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/zni-autoconso-telecharger-le-cahier-des-charges-publie-le-09-06-2020',
    },
    {
      paruLe: '30/07/2021',
      référence: '2019/S 113-276257',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/30072021-avis-modificatif-cre4-zni-autoconsommation-1',
    },
    {
      paruLe: '30/07/2021',
      référence: '2019/S 113-276257',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre-4-zni-autoconsommation-1-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
    },
  ],
}

export { autoconsommationZNI }
