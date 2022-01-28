import React from 'react'
import { Font, PDFViewer } from '@react-pdf/renderer'
import { ProjectAppelOffre } from '@entities'
import { ProjectDataForCertificate } from '@modules/project'
import { makeLaureat } from './components/Laureat'
import { Certificate } from './Certificate'
import { batiment } from '@dataAccess/inMemory/appelsOffres'
import { Elimine } from './components/Elimine'

export default { title: 'Attestations PDF' }

Font.register({
  family: 'Arial',
  fonts: [
    {
      src: '/fonts/arial.ttf',
    },
    {
      src: '/fonts/arial-bold.ttf',
      fontWeight: 'bold',
    },
  ],
})

const project: ProjectDataForCertificate = {
  appelOffre: {
    ...batiment,
    periode: { id: 'periodeId', title: 'periodeTitle' },
    famille: {},
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
  const { content, footnotes } = makeLaureat(project)
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate {...{ project, type: 'laureat', content, footnotes }} />
    </PDFViewer>
  )
}

export const EliminePPE2 = () => (
  <PDFViewer width="100%" height="900px">
    <Certificate
      {...{
        project: { ...project, isClasse: false },
        type: 'elimine',
        content: Elimine({ project }),
      }}
    />
  </PDFViewer>
)
