import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const eolien: AppelOffre = {
  id: 'Eolien',
  title:
    '2017/S 083-161855 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie mécanique du vent implantées à terre',
  shortTitle: 'Eolien 2017/S 083-161855',
  dossierSuiviPar: 'Sandra Stojkovic (sandra.stojkovic@developpement-durable.gouv.fr)',
  launchDate: 'mai 2017',
  unitePuissance: 'MW',
  tarifOuPrimeRetenue: 'le prix de référence T de l’électricité retenu',
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  paragraphePrixReference: '7.2',
  affichageParagrapheECS: false,
  paragrapheEngagementIPFPGPFC: '3.3.6',
  renvoiEngagementIPFPGPFC: '3.3.6 et 7.2.2',
  // Fourniture puissance à la pointe ?
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiSoumisAuxGarantiesFinancieres: 'est précisée au 6.2 du cahier des charges',
  renvoiRetraitDesignationGarantieFinancieres: '5.3 et 6.2',
  // Paragraphes sur l'innovation ?
  // Renvoi 3 sur l'innovation ?
  // Renvoi 4 sur l'innovation ?
  paragrapheDelaiDerogatoire: '6.4',
  delaiRealisationEnMois: 36,
  decoupageParTechnologie: false,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(36, '7.1'),
  delaiRealisationTexte: 'trente-six (36) mois',
  paragrapheAttestationConformite: '6.5',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  // Paragraphe diminution de l'offre ?
  paragrapheClauseCompetitivite: '2.7',
  afficherPhraseRegionImplantation: false,
  afficherValeurEvaluationCarbone: false,
  soumisAuxGarantiesFinancieres: true,
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
    },
    {
      id: '3',
      title: 'troisième',
      paragrapheAchevement: '6.4',
    },
    {
      id: '4',
      title: 'quatrième',
      paragrapheAchevement: '6.4',
    },
    {
      id: '5',
      title: 'cinquième',
      paragrapheAchevement: '6.4',
    },
    {
      id: '6',
      title: 'sixième',
      paragrapheAchevement: '6.4',
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'cre4.v1',
      noteThresholdByFamily: [{ familleId: '', noteThreshold: 10.19 }],
    },
    {
      id: '7',
      title: 'septième',
      paragrapheAchevement: '6.4',
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'cre4.v1',
      noteThresholdByFamily: [{ familleId: '', noteThreshold: 13 }],
    },
    {
      id: '8',
      title: 'huitième',
      paragrapheAchevement: '6.4',
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'cre4.v1',
      noteThresholdByFamily: [{ familleId: '', noteThreshold: 9.8 }],
    },
  ],
  familles: [],
}

export { eolien }
