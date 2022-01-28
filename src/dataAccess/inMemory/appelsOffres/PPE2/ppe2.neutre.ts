import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const neutrePPE2: AppelOffre = {
  id: 'PPE2 - Neutre',
  title:
    '2021/S 146-386079 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergie solaire photovoltaïque, hydroélectrique ou éolienne situées en métropole continentale',
  shortTitle: 'PPE2 - Neutre 2021/S 146-386079',
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
  tarifOuPrimeRetenue: 'le prix de référence T de l’électricité retenu',
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  paragraphePrixReference: '7',
  affichageParagrapheECS: false,
  paragrapheEngagementIPFP: '3.3.8, 4.6 et 6.6.2',
  renvoiEngagementIPFP: '3.3.8',
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.1',
  paragrapheDelaiDerogatoire: '6.3',
  delaiRealisationEnMois: 30 | 36,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(30 | 36, '7.1'),
  delaiRealisationTexte:
    'trente (30) mois pour les installations photovoltaïques ou trente-six (36) mois pour les installations éoliennes ou hydroélectriques',
  paragrapheAttestationConformite: '6.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  paragrapheClauseCompetitivite: '2.14',
  afficherPhraseRegionImplantation: false,
  afficherValeurEvaluationCarbone: true,
  periodes: [],
  familles: [
    // seulement sur les installations hydrauliques
    {
      id: '1',
      title:
        'installations implantées sur de nouveaux sites, de puissance installée supérieure ou égale à 1 MW ',
    },
    {
      id: '2',
      title:
        'installations équipant des sites existants, de puissance installée supérieure ou égale à 1 MW',
    },
  ],
}

export { neutrePPE2 }
