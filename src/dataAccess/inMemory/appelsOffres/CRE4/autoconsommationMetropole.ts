import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const autoconsommationMetropole: AppelOffre = {
  id: 'CRE4 - Autoconsommation métropole',
  type: 'autoconso',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées en métropole continentale',
  shortTitle: 'CRE4 - Autoconsommation métropole',
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
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/autoconso-metropole-ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-1ere-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Autoconso-Ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-2eme-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '3',
      title: 'troisième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-24-avril-2018',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '4',
      title: 'quatrième',
      paragrapheAchevement: '6.3',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-4eme-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '5',
      title: 'cinquième',
      paragrapheAchevement: '6.3',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-22-novembre-20182',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '6',
      title: 'sixième',
      paragrapheAchevement: '6.3',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Autoconso-Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-18-juin-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '7',
      title: 'septième',
      paragrapheAchevement: '6.3',
      noteThreshold: 20.04,
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        reference: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/autoconsommation-02-01-2020-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '8',
      title: 'huitième',
      paragrapheAchevement: '6.3',
      noteThreshold: 32.04,
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ao-autoconso-metro-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-04-juin-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '9',
      title: 'neuvième',
      paragrapheAchevement: '6.3',
      noteThreshold: 9.9,
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ao-autoconso-metro-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-04-juin-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '10',
      title: 'dixième',
      paragrapheAchevement: '6.3',
      noteThreshold: 44.9,
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-26-avril-2021',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
  ],
  familles: [],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/07/2021',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/30072021-avis-modificatif-cre4-autoconsommation-metropole-2',
    },
  ],
}

export { autoconsommationMetropole }
