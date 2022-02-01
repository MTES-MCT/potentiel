import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

export const zni2017: AppelOffre = {
  id: 'CRE4 - ZNI 2017',
  title:
    '2016/S 242-441980 portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir de techniques de conversion du rayonnement solaire d’une puissance supérieure à 100 kWc et situées dans les zones non interconnectées',
  shortTitle: 'CRE4 - ZNI 2016/S 242-441980',
  launchDate: 'mai 2015',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 36,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(36, '7'),
  delaiRealisationTexte: 'trente-six (36) mois',
  paragraphePrixReference: '4.4',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFP: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.3',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '7.1',
  renvoiEngagementIPFP: '',
  paragrapheClauseCompetitivite: '',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  renvoiSoumisAuxGarantiesFinancieres: 'doit être au minimum de 36 mois',
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.4',
      isNotifiedOnPotentiel: false,
    },
  ],
  familles: [
    // 2017 ZNI avec stockage
    {
      id: '1',
      title: '1. 100kWc - 250kWc',
    },
    {
      id: '2',
      title: '2. 250kWc - 1,5MWc',
    },
    {
      id: '3',
      title: '3. 250kWc - 5MWc',
    },
  ],
}
