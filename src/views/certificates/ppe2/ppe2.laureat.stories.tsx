import React from 'react'
import { Font, PDFViewer } from '@react-pdf/renderer'
import { ProjectAppelOffre } from '@entities'
import { ProjectDataForCertificate } from '@modules/project'
import { makeLaureat } from './components/Laureat'
import { Certificate } from './Certificate'
import { eolienPPE2 } from '@dataAccess/inMemory/appelsOffres'

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

const fakeProject: ProjectDataForCertificate = {
  appelOffre: {
    ...eolienPPE2,
    affichageParagrapheECS: true,
    periode: { id: 'periodeId', title: 'periodeTitle' },
  } as ProjectAppelOffre,
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
