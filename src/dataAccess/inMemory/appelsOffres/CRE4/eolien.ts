import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const eolien: AppelOffre = {
  id: 'Eolien',
  type: 'eolien',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie mécanique du vent implantées à terre',
  shortTitle: 'Eolien',
  dossierSuiviPar: 'Sandra Stojkovic (sandra.stojkovic@developpement-durable.gouv.fr)',
  launchDate: 'mai 2017',
  unitePuissance: 'MW',
  tarifOuPrimeRetenue: 'le prix de référence T de l’électricité retenu',
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  paragraphePrixReference: '7.2',
  affichageParagrapheECS: false,
  paragrapheEngagementIPFPGPFC: '3.3.6',
  renvoiEngagementIPFPGPFC: '3.3.6 et 7.2.2',
  // Fourniture puissance à la pointe ?
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiSoumisAuxGarantiesFinancieres: 'est précisée au 6.2 du cahier des charges',
  renvoiRetraitDesignationGarantieFinancieres: '5.3 et 6.2',
  // Paragraphes sur l'innovation ?
  // Renvoi 3 sur l'innovation ?
  // Renvoi 4 sur l'innovation ?
  paragrapheDelaiDerogatoire: '6.4',
  delaiRealisationEnMois: 36,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(36, '7.1'),
  delaiRealisationTexte: 'trente-six (36) mois',
  paragrapheAttestationConformite: '6.5',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  // Paragraphe diminution de l'offre ?
  paragrapheClauseCompetitivite: '2.7',
  afficherPhraseRegionImplantation: false,
  afficherValeurEvaluationCarbone: false,
  soumisAuxGarantiesFinancieres: 'après candidature',
  garantieFinanciereEnMois: 51,
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
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-1ere-periode-ao-eolien-08112017',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cdc-eolien-ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-2eme-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '3',
      title: 'troisième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cahier-des-charges_3eperioTelecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-04-mars-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '4',
      title: 'quatrième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Eolien-Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-18-juin-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '5',
      title: 'cinquième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-23-octobre-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '6',
      title: 'sixième',
      paragrapheAchevement: '6.4',
      certificateTemplate: 'cre4.v1',
      noteThreshold: 10.19,
      cahierDesCharges: {
        reference: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/eolien-terrestre-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-4-mai-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '7',
      title: 'septième',
      paragrapheAchevement: '6.4',
      certificateTemplate: 'cre4.v1',
      noteThreshold: 13,
      cahierDesCharges: {
        reference: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/eolien-terrestre-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-4-mai-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '8',
      title: 'huitième',
      paragrapheAchevement: '6.4',
      certificateTemplate: 'cre4.v1',
      noteThreshold: 9.8,
      cahierDesCharges: {
        reference: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ao-terrestre-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-19-fevrier-2021',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
  ],
  familles: [],
  cahiersDesChargesModifiésDisponibles: [
    // {
    //   paruLe: '30/08/2022',
    //   url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre-4-eolien-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
    // },
  ],
}

export { eolien }
