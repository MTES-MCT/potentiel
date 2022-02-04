import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const innovation: AppelOffre = {
  id: 'CRE4 - Innovation',
  title:
    '2017/S 051-094731 portant sur la réalisation et l’exploitation d’Installations de production d’électricité innovantes à partir de l’énergie solaire, sans dispositifs de stockage',
  shortTitle: 'CRE4 - Innovation 2017/S 051-094731',
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
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.3',
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.3',
      noteThresholdByFamily: [
        { familleId: '1', noteThreshold: 71.58 },
        { familleId: '2', noteThreshold: 45.49 },
      ],
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'cre4.v0',
    },
    {
      id: '3',
      title: 'troisième',
      paragrapheAchevement: '6.3',
      noteThresholdByFamily: [
        { familleId: '1', noteThreshold: 64.21 },
        { familleId: '2', noteThreshold: 59.32 },
      ],
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'cre4.v1',
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
