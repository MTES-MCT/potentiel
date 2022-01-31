import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const solPPE2: AppelOffre = {
  id: 'PPE2 - Sol',
  title:
    '2021/S 146-386062 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « Centrales au sol »',
  shortTitle: 'PPE2 - Sol 2021/S 146-386062',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
  delaiRealisationEnMois: 30,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(30, '7.1'),
  delaiRealisationTexte: 'trente (30) mois',
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFP: '3.2.7, 4.5 et 6.6.2',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.1',
  soumisAuxGarantiesFinancieres: true,
  renvoiEngagementIPFP: '3.2.7',
  paragrapheClauseCompetitivite: '2.10',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement,
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'ppe2',
    },
  ],
  familles: [],
}

export { solPPE2 }
