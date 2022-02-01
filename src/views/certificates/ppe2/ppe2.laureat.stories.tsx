import React from 'react'
import { Font, PDFViewer } from '@react-pdf/renderer'
import { Famille, Periode, ProjectAppelOffre } from '@entities'
import { ProjectDataForCertificate } from '@modules/project'
import { makeLaureat } from './components/Laureat'
import { Certificate } from './Certificate'
import { makeParagrapheAchevementForDelai } from '@dataAccess/inMemory/appelsOffres'

export default { title: 'Attestations PDF' }

Font.register({
  family: 'Arimo',
  fonts: [
    {
      src: '/fonts/arimo/Arimo-Regular.ttf',
    },
    {
      src: '/fonts/arimo/Arimo-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: '/fonts/arimo/Arimo-Italic.ttf',
      fontStyle: 'italic',
    },
  ],
})

const fakeAoEolienPPE2 = {
  id: 'PPE2 - Eolien',
  title:
    '2021/S 146-386083 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie mécanique du vent implantées à terre',
  shortTitle: 'PPE2 - Eolien 2021/S 146-386083',
  dossierSuiviPar: 'violaine.tarizzo@developpement-durable.gouv.fr',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
  tarifOuPrimeRetenue: 'le prix de référence T de l’électricité retenu',
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  paragraphePrixReference: '7',
  affichageParagrapheECS: true,
  paragrapheEngagementIPFP: '3.3.7, 4.3 et 6.5.2',
  renvoiEngagementIPFP: '3.3.7',
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.1',
  soumisAuxGarantiesFinancieres: true,
  paragrapheDelaiDerogatoire: '6.3',
  delaiRealisationEnMois: 36,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(36, '7.1'),
  delaiRealisationTexte: 'trente-six (36) mois',
  paragrapheAttestationConformite: '6.5',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  paragrapheClauseCompetitivite: '2.11',
  afficherPhraseRegionImplantation: false,
  afficherValeurEvaluationCarbone: true,
  periodes: [] as Periode[],
  familles: [] as Famille[],
  periode: { id: 'periodeId', title: 'periodeTitle' } as Periode,
} as ProjectAppelOffre

const fakeProject: ProjectDataForCertificate = {
  appelOffre: fakeAoEolienPPE2,
  isClasse: true,
  familleId: 'famille',
  prixReference: 42,
  evaluationCarbone: 42,
  isFinancementParticipatif: true,
  isInvestissementParticipatif: true,
  engagementFournitureDePuissanceAlaPointe: true,
  motifsElimination: 'motifsElimination',
  note: 42,
  notifiedOn: 42,
  nomRepresentantLegal: 'nomRepresentantLegal',
  nomCandidat: 'nomCandidat',
  email: 'email',
  nomProjet: 'nomProjet',
  adresseProjet: 'adresseProjet',
  codePostalProjet: 'codePostalProjet',
  communeProjet: 'communeProjet',
  puissance: 42,
  potentielId: 'potentielId',
  territoireProjet: 'territoireProjet',
}

export const LaureatPPE2 = () => {
  const { content, footnotes } = makeLaureat(fakeProject)
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate {...{ project: fakeProject, type: 'laureat', content, footnotes }} />
    </PDFViewer>
  )
}
