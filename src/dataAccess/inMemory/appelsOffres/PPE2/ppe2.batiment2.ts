import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const batiment2PPE2: AppelOffre = {
  id: 'PPE2 - Bâtiment 2',
  type: 'batiment',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « Centrales sur bâtiments, serres et hangars agricoles et ombrières de parking de puissance supérieure à 500 kWc»',
  shortTitle: 'PPE2 - Bâtiment 2',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
  delaiRealisationEnMois: 30,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(30, '7.1.1'),
  delaiRealisationTexte: 'trente (30) mois',
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '3.2.7, 4.4 et 6.5.2',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.1',
  soumisAuxGarantiesFinancieres: true,
  garantiesFinancieresDeposeesALaCandidature: true,
  renvoiEngagementIPFPGPFC: '3.2.7',
  paragrapheClauseCompetitivite: '2.9',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  delaiDcrEnMois: { valeur: 3, texte: 'trois' },
  changementPuissance: {
    ratios: {
      min: 0.9,
      max: 1.1,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.3',
      certificateTemplate: 'ppe2.v1',
      reference: '2021 S 176-457518',
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 18.79,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 26.46,
        },
      },
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.3',
      certificateTemplate: 'ppe2.v1',
      reference: '2022 S 020-047803',
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 12.9244110177221,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 11.4362187267599,
        },
      },
    },
  ],
  familles: [],
}

export { batiment2PPE2 }
