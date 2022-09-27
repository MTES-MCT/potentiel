import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const garantieFinanciereEnMois = 42

const sol: AppelOffre = {
  id: 'CRE4 - Sol',
  type: 'sol',
  title:
    'portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir de l’énergie solaire « Centrale au sol »',
  shortTitle: 'CRE4 - Sol',
  launchDate: 'août 2016',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(24, '7.1'),
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFPGPFC: '3.2.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.3 et 6.2',
  renvoiEngagementIPFPGPFC: '3.2.6 et 7.2.2',
  paragrapheClauseCompetitivite: '2.8',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  renvoiSoumisAuxGarantiesFinancieres: `doit être au minimum de ${garantieFinanciereEnMois} mois`,
  changementPuissance: {
    ratios: {
      min: 0.9,
      max: 1.1,
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
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-1ere-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-2eme-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '3',
      title: 'troisième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-3eme-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '4',
      title: 'quatrième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-aux-4eme-et-5eme-periodes',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '5',
      title: 'cinquième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-aux-4eme-et-5eme-periodes',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '6',
      title: 'sixième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-4-avril-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '7',
      title: 'septième',
      paragrapheAchevement: '6.4',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 56.6 },
        { familleId: '2', noteThreshold: 48.17 },
        { familleId: '3', noteThreshold: 54.15 },
      ],
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-derniere-version-modifiee-le-5-septembre-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '8',
      title: 'huitième',
      paragrapheAchevement: '6.4',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 55.25 },
        { familleId: '2', noteThreshold: 52.04 },
        { familleId: '3', noteThreshold: 54.35 },
      ],
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/ao-solaire-au-sol-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-derniere-version-modifiee-le-29-octobre-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '9',
      title: 'neuvième',
      paragrapheAchevement: '6.4',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 48.6 },
        { familleId: '2', noteThreshold: 45.49 },
        { familleId: '3', noteThreshold: 36.02 },
      ],
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/ao-solaire-au-sol-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-derniere-version-modifiee-le-29-octobre-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '10',
      title: 'dixième',
      paragrapheAchevement: '6.4',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 46.86 },
        { familleId: '2', noteThreshold: 43.96 },
        { familleId: '3', noteThreshold: 23.94 },
      ],
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        reference: '2016/S 148-268152',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-en-vigueur-dans-sa-derniere-version-modifiee-le-12-fevrier-2021',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
  ],
  familles: [
    {
      id: '1',
      title: '1. 5 MWc – 30 Mwc',
      soumisAuxGarantiesFinancieres: 'après candidature',
      garantieFinanciereEnMois,
    },
    {
      id: '2',
      title: '2. 500kWc - 5MWc',
      soumisAuxGarantiesFinancieres: 'après candidature',
      garantieFinanciereEnMois,
    },
    {
      id: '3',
      title: '3. 500 kWc - 10MWc',
      soumisAuxGarantiesFinancieres: 'après candidature',
      garantieFinanciereEnMois,
    },
  ],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/07/2021',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/30072021-avis-modificatif-cre4-sol',
    },
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre4-sol-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      numéroGestionnaireRequis: true,
    },
  ],
}

export { sol }
