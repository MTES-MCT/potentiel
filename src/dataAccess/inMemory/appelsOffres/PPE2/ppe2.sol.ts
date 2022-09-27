import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const solPPE2: AppelOffre = {
  id: 'PPE2 - Sol',
  type: 'sol',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « Centrales au sol »',
  shortTitle: 'PPE2 - Sol',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
  delaiRealisationEnMois: 30,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(30, '7.1'),
  delaiRealisationTexte: 'trente (30) mois',
  decoupageParTechnologie: false,
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFPGPFC: '3.2.7, 4.5 et 6.6.2',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.1',
  soumisAuxGarantiesFinancieres: 'à la candidature',
  renvoiEngagementIPFPGPFC: '3.2.7',
  paragrapheClauseCompetitivite: '2.10',
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
        référence: '2021 S 211-553136',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-pv-sol-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 46.95,
          puissanceMax: 5,
        },
        autres: {
          noteThreshold: 54.9,
        },
      },
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.3',
      certificateTemplate: 'ppe2.v1',
      cahierDesCharges: {
        référence: '2022/S 061-160516',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2022-pv-sol-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 35.25,
          puissanceMax: 5,
        },
        autres: {
          noteThreshold: 46.74,
        },
      },
    },
    // Pour les prochaines periodes utiliser le certificateTemplate ppe2.v2
  ],
  familles: [],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ppe-2-sol-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      numéroGestionnaireRequis: true,
    },
  ],
}

export { solPPE2 }
