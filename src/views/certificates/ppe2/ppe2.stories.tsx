import React from 'react'
import { Font, PDFViewer } from '@react-pdf/renderer'
import { ProjectAppelOffre } from '@entities'
import { ProjectDataForCertificate } from '@modules/project'
import { makeLaureat } from './components/Laureat'
import { Certificate } from './Certificate'
import { batiment, eolien } from '@dataAccess/inMemory/appelsOffres'
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

const fakeProject: ProjectDataForCertificate = {
  appelOffre: {
    ...eolien,
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

export const EliminePPE2AuDessusDePcible = () => {
  const project: ProjectDataForCertificate = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Au-dessus de Pcible',
  }
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate
        {...{
          project,
          type: 'elimine',
          content: Elimine({ project }),
        }}
      />
    </PDFViewer>
  )
}

export const EliminePPE2DéjàLauréatNonInstruit = () => {
  const project: ProjectDataForCertificate = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Déjà lauréat - Non instruit',
  }
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate
        {...{
          project,
          type: 'elimine',
          content: Elimine({ project }),
        }}
      />
    </PDFViewer>
  )
}

export const EliminePPE2Competitivite = () => {
  const project: ProjectDataForCertificate = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: '20% compétitivité',
  }
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate
        {...{
          project,
          type: 'elimine',
          content: Elimine({ project }),
        }}
      />
    </PDFViewer>
  )
}

export const EliminePPE2AutreMotif = () => {
  const project: ProjectDataForCertificate = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Autre motif',
  }
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate
        {...{
          project,
          type: 'elimine',
          content: Elimine({ project }),
        }}
      />
    </PDFViewer>
  )
}

export const EliminePPE2AutreMotifNonSoumisAuxGF = () => {
  const project: ProjectDataForCertificate = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Autre motif',
    appelOffre: { ...fakeProject.appelOffre, ...batiment },
  }
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate
        {...{
          project,
          type: 'elimine',
          content: Elimine({ project }),
        }}
      />
    </PDFViewer>
  )
}
