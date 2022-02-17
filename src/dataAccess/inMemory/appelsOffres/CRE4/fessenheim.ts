import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const fessenheim: AppelOffre = {
  id: 'Fessenheim',
  type: 'autre',
  title:
    '2019/S 019-040037 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « transition énergétique du territoire de Fessenheim »',
  shortTitle: 'Fessenheim 2019/S 019-040037',
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
  renvoiSoumisAuxGarantiesFinancieres: 'doit être au minimum de 42 mois',
  changementPuissance: {
    autoAcceptRatios: {
      min: 0.9,
      max: 1.1,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.4',
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
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'cre4.v0',
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
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'cre4.v0',
    },
  ],
  familles: [
    {
      id: '1',
      title: '1',
      garantieFinanciereEnMois: 42,
      soumisAuxGarantiesFinancieres: true,
    },
    {
      id: '2',
      title: '2',
      garantieFinanciereEnMois: 42,
      soumisAuxGarantiesFinancieres: true,
    },
    {
      id: '3',
      title: '3',
    },
  ],
}

export { fessenheim }
