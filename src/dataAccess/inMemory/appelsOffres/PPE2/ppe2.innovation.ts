import { AppelOffre } from '@entities'
import { makeParagrapheAchevementForDelai } from '../commonDataFields'

const innovationPPE2: AppelOffre = {
  id: 'PPE2 - Innovation',
  type: 'innovation',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité innovantes à partir de l’énergie solaire sans dispositifs de stockage',
  shortTitle: 'PPE2 - Innovation',
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
  changementPuissance: {
    ratios: {
      min: 0.7,
      max: 1.1,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.3',
      type: 'not-yet-notified',
      certificateTemplate: 'ppe2.v1',
      cahierDesCharges: {
        reference: '2021 S 203-530267',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ppe2-innovant-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-19-octobre-2021',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
    },
    // Pour les prochaines periodes utiliser le certificateTemplate ppe2.v2
  ],
  familles: [
    {
      id: '1',
      title:
        'Installations photovoltaïques innovantes au sol de Puissance strictement supérieure à 500 kWc et inférieure ou égale à 3 MWc',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
    {
      id: '2',
      title:
        'Installations photovoltaïques innovantes sur Bâtiments, Serres agricoles Hangars, Ombrières, ou Installations agrivoltaïques innovantes de Puissance strictement supérieure à 100 kWc et inférieure ou égale à 3 MWc',
      soumisAuxGarantiesFinancieres: 'non soumis',
    },
  ],
  cahiersDesChargesModifiésDisponibles: [
    {
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ppe2-inno-2022-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      numéroGestionnaireRequis: true,
    },
  ],
}

export { innovationPPE2 }
