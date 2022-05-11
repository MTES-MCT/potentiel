import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const eolienPPE2: AppelOffre = {
  id: 'PPE2 - Eolien',
  type: 'eolien',
  title:
    '${referencePeriode} portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie mécanique du vent implantées à terre',
  shortTitle: 'PPE2 - Eolien',
  dossierSuiviPar: 'violaine.tarizzo@developpement-durable.gouv.fr',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
  tarifOuPrimeRetenue: 'le prix de référence T de l’électricité retenu',
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  paragraphePrixReference: '7',
  affichageParagrapheECS: false,
  paragrapheEngagementIPFPGPFC: '3.3.7, 4.3 et 6.5.2',
  renvoiEngagementIPFPGPFC: '3.3.7',
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.1',
  soumisAuxGarantiesFinancieres: true,
  garantiesFinancieresDeposeesALaCandidature: true,
  paragrapheDelaiDerogatoire: '6.3',
  delaiRealisationEnMois: 36,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(36, '7.1'),
  delaiRealisationTexte: 'trente-six (36) mois',
  decoupageParTechnologie: false,
  paragrapheAttestationConformite: '6.5',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  paragrapheClauseCompetitivite: '2.11',
  afficherPhraseRegionImplantation: false,
  afficherValeurEvaluationCarbone: true,
  changementPuissance: {
    ratios: {
      min: 0.8,
      max: 1.2,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'ppe2.v1',
      paragrapheAchevement: '6.3',
      noteThreshold: 0.68,
      reference: '2021/S 146-386083',
    },
  ],
  familles: [],
}

export { eolienPPE2 }
