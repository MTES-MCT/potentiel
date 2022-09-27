import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const garantieFinanciereEnMois = 36

const batiment: AppelOffre = {
  id: 'CRE4 - Bâtiment',
  type: 'batiment',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « Centrales sur bâtiments, serres et hangars agricoles et ombrières de parking de puissance comprise entre 100 kWc et 8 MWc »',
  shortTitle: 'CRE4 - Bâtiment',
  launchDate: 'septembre 2016',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 20,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(20, '7.1'),
  delaiRealisationTexte: 'vingt (20) mois',
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFPGPFC: '3.2.5',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.3 et 6.2',
  renvoiEngagementIPFPGPFC: '3.2.5 et 7.1.2',
  paragrapheClauseCompetitivite: '2.6',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  renvoiSoumisAuxGarantiesFinancieres: `doit être au minimum de ${garantieFinanciereEnMois.toString()} mois`,
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
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/aopvbat-ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-1ere-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/aopvbat-ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-aux-2eme-et-3eme-periodes',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '3',
      title: 'troisième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/aopvbat-ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-aux-2eme-et-3eme-periodes',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '4',
      title: 'quatrième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-dans-sa-version-modifiee-le-11-decembre-2017',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '5',
      title: 'cinquième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-11-juin-2018',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '6',
      title: 'sixième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-6eme-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '7',
      title: 'septième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-22-novembre-2018',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '8',
      title: 'huitième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/PV-batiment-Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-18-juin-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '9',
      title: 'neuvième',
      paragrapheAchevement: '6.4',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/PV-BAT-Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-07-octobre-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '10',
      title: 'dixième',
      paragrapheAchevement: '6.4',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 27.91 },
        { familleId: '2', noteThreshold: 25.62 },
      ],
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ao-pv-bat-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-05-fevrier-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '11',
      title: 'onzième',
      paragrapheAchevement: '6.4',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 30.82 },
        { familleId: '2', noteThreshold: 29.85 },
      ],
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-16-juin-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '12',
      title: 'douzième',
      paragrapheAchevement: '6.4',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 33.77 },
        { familleId: '2', noteThreshold: 32.8 },
      ],
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ao-bat-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-03-fevrier-2021',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '13',
      title: 'treizième',
      paragrapheAchevement: '6.4',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 22.59 },
        { familleId: '2', noteThreshold: 26.91 },
      ],
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2016/S 174-312851',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-23-juin-2021',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
  ],
  familles: [
    {
      id: '1',
      title: '1. 100 kWc – 500 Mwc',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    {
      id: '2',
      title: '2. 500 kWc – 8 MWc',
      garantieFinanciereEnMois,
      soumisAuxGarantiesFinancieres: 'après candidature',
    },
  ],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/07/2021',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/30072021-avis-modificatif-cre4-batiment',
    },
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre4-batiment-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      numéroGestionnaireRequis: true,
    },
  ],
}

export { batiment }
