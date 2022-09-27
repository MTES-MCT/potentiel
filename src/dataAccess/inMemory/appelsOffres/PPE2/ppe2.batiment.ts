import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const batimentPPE2: AppelOffre = {
  id: 'PPE2 - Bâtiment',
  type: 'batiment',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « Centrales sur bâtiments, serres et hangars agricoles et ombrières de parking de puissance supérieure à 500 kWc»',
  shortTitle: 'PPE2 - Bâtiment',
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
  soumisAuxGarantiesFinancieres: 'à la candidature',
  renvoiEngagementIPFPGPFC: '3.2.7',
  paragrapheClauseCompetitivite: '2.9',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
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
      cahierDesCharges: {
        référence: '2021 S 176-457518',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-pv-batiment-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
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
      cahierDesCharges: {
        référence: '2022 S 020-047803',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-pv-batiment-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
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
    {
      id: '3',
      title: 'troisième',
      paragrapheAchevement: '6.3',
      certificateTemplate: 'ppe2.v2',
      cahierDesCharges: {
        référence: '2022 S 093-254888',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-pv-batiment-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 11.72,
          puissanceMax: 1,
        },
        autres: {
          noteThreshold: 13.82,
        },
      },
    },
  ],
  familles: [],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      numéroGestionnaireRequis: true,
    },
  ],
}

export { batimentPPE2 }
