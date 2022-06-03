import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const innovation: AppelOffre = {
  id: 'CRE4 - Innovation',
  type: 'innovation',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité innovantes à partir de l’énergie solaire, sans dispositifs de stockage',
  shortTitle: 'CRE4 - Innovation',
  launchDate: 'mars 2017',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(24, '7.1'),
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  paragraphePrixReference: '7.1',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.3',
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  changementPuissance: {
    ratios: {
      min: 0.7,
      max: 1,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.3',
      type: 'legacy',
      reference: '2017/S 051-094731',
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.3',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 71.58 },
        { familleId: '2', noteThreshold: 45.49 },
      ],
      certificateTemplate: 'cre4.v0',
      reference: '2017/S 051-094731',
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '3',
      title: 'troisième',
      paragrapheAchevement: '6.3',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 64.21 },
        { familleId: '2', noteThreshold: 59.32 },
      ],
      certificateTemplate: 'cre4.v1',
      reference: '2017/S 051-094731',
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
  ],
  familles: [
    // La période 1 a les familles 1a, 1b, 2, 3 et 4
    // Les périodes 2 et 3 ont les familles 1 et 2 seulement
    {
      id: '1a',
      title: "1a. Nouvelles conceptions d'intégration",
    },
    {
      id: '1b',
      title: '1b. Autres innovations de composants',
    },
    {
      id: '3',
      title: "3. Innovation liée à l'optimisation et à l'exploitation électrique de la centrale",
    },
    {
      id: '4',
      title: '4. Agrivoltaïsme',
    },
    {
      id: '1',
      title: '1. 500 kWc - 5MWc',
    },
    {
      id: '2',
      title: '2. 100 kWc - 3MWc',
    },
  ],
}

export { innovation }
