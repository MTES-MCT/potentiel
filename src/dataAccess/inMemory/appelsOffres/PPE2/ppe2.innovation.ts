import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const innovationPPE2: AppelOffre = {
  id: 'PPE2 - Innovation',
  innovation: true,
  title:
    '2021 S 203-530267 portant sur la réalisation et l’exploitation d’Installations de production d’électricité innovantes à partir de l’énergie solaire sans dispositifs de stockage',
  shortTitle: 'PPE2 - Innovation 2021 S 203-530267',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
  delaiRealisationEnMois: 30,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(30, '7.1.1'),
  delaiRealisationTexte: 'trente (30) mois',
  decoupageParTechnologie: false,
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '',
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.3',
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'ppe2.v1',
    },
  ],
  familles: [
    {
      id: '1',
      title:
        'Installations photovoltaïques innovantes au sol de Puissance strictement supérieure à 500 kWc et inférieure ou égale à 3 MWc',
    },
    {
      id: '2',
      title:
        'Installations photovoltaïques innovantes sur Bâtiments, Serres agricoles Hangars, Ombrières, ou Installations agrivoltaïques innovantes de Puissance strictement supérieure à 100 kWc et inférieure ou égale à 3 MWc',
    },
  ],
}

export { innovationPPE2 }
