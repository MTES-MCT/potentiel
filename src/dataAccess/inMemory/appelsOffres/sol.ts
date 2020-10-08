import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'
import toTypeLiteral from './helpers/toTypeLiteral'

const sol: AppelOffre = {
  id: 'CRE4 - Sol',
  title:
    '2016/S 148-268152 portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir de l’énergie solaire « Centrale au sol »',
  shortTitle: 'CRE4 - Sol 2016/S 148-268152',
  launchDate: 'Août 2016',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFP: '3.2.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.3 et 6.2',
  renvoiEngagementIPFP: '3.2.6 et 7.2.2',
  paragrapheClauseCompetitivite: '2.8',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  renvoiSoumisAuxGarantiesFinancieres: 'doit être au minimum de 42 mois',
  dataFields: [
    ...commonDataFields,
    {
      // This field is mandatory
      field: 'evaluationCarbone',
      type: toTypeLiteral('number'),
      column:
        'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
    },
  ],
  periodes: [
    {
      id: '1',
      title: 'première',
    },
    {
      id: '2',
      title: 'deuxième',
    },
    {
      id: '3',
      title: 'troisième',
    },
    {
      id: '4',
      title: 'quatrième',
    },
    {
      id: '5',
      title: 'cinquième',
    },
    {
      id: '6',
      title: 'sixième',
    },
    {
      id: '7',
      title: 'septième',
      noteThresholdByFamily: [
        { familleId: '1', noteThreshold: 56.6 },
        { familleId: '2', noteThreshold: 48.17 },
        { familleId: '3', noteThreshold: 54.15 },
      ],
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'v0',
    },
    {
      id: '8',
      title: 'huitième',
      noteThresholdByFamily: [
        { familleId: '1', noteThreshold: 0 },
        { familleId: '2', noteThreshold: 0 },
        { familleId: '3', noteThreshold: 0 },
      ],
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'v1',
    },
  ],
  familles: [
    {
      id: '1',
      title: '1. 5 MWc – 30 Mwc',
      garantieFinanciereEnMois: 42,
    },
    {
      id: '2',
      title: '2. 500kWc - 5MWc',
      garantieFinanciereEnMois: 42,
    },
    {
      id: '3',
      title: '3. 500 kWc - 10MWc',
      garantieFinanciereEnMois: 42,
    },
  ],
}

export { sol }
