import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const garantieFinanciereEnMois = 42

const fessenheim: AppelOffre = {
  id: 'Fessenheim',
  type: 'autre',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « transition énergétique du territoire de Fessenheim »',
  shortTitle: 'Fessenheim',
  launchDate: 'janvier 2019',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(24, '7.1.1'),
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFPGPFC: '3.2.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.3 et 6.2',
  renvoiEngagementIPFPGPFC: '3.2.6 et 7.1.2',
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
        reference: '2019/S 019-040037',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Telecharger-le-cahier-des-charges-publie-le-24-01-20192',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.4',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 69.34 },
        { familleId: '3', noteThreshold: 1.52 },
      ],
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        reference: '2019/S 019-040037',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/AO-Fessemheim-Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-04-octobre-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
    {
      id: '3',
      title: 'troisième',
      paragrapheAchevement: '6.4',
      noteThresholdBy: 'family',
      noteThreshold: [
        { familleId: '1', noteThreshold: 21.15 },
        { familleId: '2', noteThreshold: 89.09 },
        { familleId: '3', noteThreshold: 18.43 },
      ],
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        reference: '2019/S 019-040037',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ao-fessenheim-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-27-mai-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
  ],
  familles: [
    {
      id: '1',
      title: '1',
      garantieFinanciereEnMois,
      soumisAuxGarantiesFinancieres: 'après candidature',
    },
    {
      id: '2',
      title: '2',
      garantieFinanciereEnMois,
      soumisAuxGarantiesFinancieres: 'après candidature',
    },
    {
      id: '3',
      title: '3',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
  ],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/07/2021',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/30072021-avis-modificatif-cre4-fessenheim',
    },
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre-4-fessenheim-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
    },
  ],
}

export { fessenheim }
