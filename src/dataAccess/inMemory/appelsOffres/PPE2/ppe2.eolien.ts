import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const eolienPPE2: AppelOffre = {
  id: 'PPE2 - Eolien',
  type: 'eolien',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie mécanique du vent implantées à terre',
  shortTitle: 'PPE2 - Eolien',
  dossierSuiviPar: 'tiphany.genin@developpement-durable.gouv.fr',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
  tarifOuPrimeRetenue: 'le prix de référence T de l’électricité retenu',
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  paragraphePrixReference: '7',
  affichageParagrapheECS: false,
  paragrapheEngagementIPFPGPFC: '3.3.7, 4.3 et 6.5.2',
  renvoiEngagementIPFPGPFC: '3.3.7',
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.1',
  soumisAuxGarantiesFinancieres: 'à la candidature',
  paragrapheDelaiDerogatoire: '6.3',
  delaiRealisationEnMois: 36,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(36, '7.1'),
  delaiRealisationTexte: 'trente-six (36) mois',
  decoupageParTechnologie: false,
  paragrapheAttestationConformite: '6.5',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  paragrapheClauseCompetitivite: '2.11',
  afficherPhraseRegionImplantation: false,
  afficherValeurEvaluationCarbone: true,
  changementPuissance: {
    ratios: {
      min: 0.8,
      max: 1.2,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'ppe2.v1',
      paragrapheAchevement: '6.3',
      noteThreshold: 0.68,
      cahierDesCharges: {
        référence: '2021/S 146-386083',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-eolien-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      dossierSuiviPar: 'violaine.tarizzo@developpement-durable.gouv.fr',
    },
    {
      id: '2',
      title: 'deuxième',
      certificateTemplate: 'ppe2.v2',
      paragrapheAchevement: '6.3',
      noteThreshold: 0.692142857142864,
      cahierDesCharges: {
        référence: '2022/S 035-088651',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-eolien-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
    },
  ],
  familles: [],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ppe-2-eolien-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      numéroGestionnaireRequis: true,
    },
  ],
}

export { eolienPPE2 }
