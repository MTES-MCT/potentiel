import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const garantieFinanciereEnMois = 36

export const zni2017: AppelOffre = {
  id: 'CRE4 - ZNI 2017',
  type: 'zni',
  title:
    'portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir de techniques de conversion du rayonnement solaire d’une puissance supérieure à 100 kWc et situées dans les zones non interconnectées',
  shortTitle: 'CRE4 - ZNI 2017',
  launchDate: 'mai 2015',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 36,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(36, '7'),
  delaiRealisationTexte: 'trente-six (36) mois',
  paragraphePrixReference: '4.4',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFPGPFC: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.3',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '7.1',
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '',
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
      reference: '2016/S 242-441980',
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
    },
  ],
  familles: [
    // 2017 ZNI avec stockage
    {
      id: '1',
      title: '1. 100kWc - 250kWc',
      soumisAuxGarantiesFinancieres: 'après candidature',
      garantieFinanciereEnMois,
    },
    {
      id: '2',
      title: '2. 250kWc - 1,5MWc',
      soumisAuxGarantiesFinancieres: 'après candidature',
      garantieFinanciereEnMois,
    },
    {
      id: '3',
      title: '3. 250kWc - 5MWc',
      soumisAuxGarantiesFinancieres: 'après candidature',
      garantieFinanciereEnMois,
    },
  ],
  cahiersDesChargesDisponibles: [
    {
      paruLe: 'avant le 30/07/2021',
      référence: '2016/S 242-441980',
      periodeInitiale: 1,
      url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-pv-stockage-zni',
    },
    {
      paruLe: '30/07/2021',
      référence: '2016/S 242-441980',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/30072021-avis-modificatif-cre4-zni-1',
    },
    {
      paruLe: '30/08/2022',
      référence: '2016/S 242-441980',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre-4-zni-1-2022-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
    },
  ],
}
