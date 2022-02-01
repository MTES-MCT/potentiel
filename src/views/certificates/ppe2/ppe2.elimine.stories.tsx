import React from 'react'
import { Font, PDFViewer } from '@react-pdf/renderer'
import { ProjectAppelOffre } from '@entities'
import { ProjectDataForCertificate } from '@modules/project'
import { Certificate } from './Certificate'
import { batiment, eolien } from '@dataAccess/inMemory/appelsOffres'
import { Elimine } from './components/elimine/Elimine'

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
    ...eolien,
    soumisAuxGarantiesFinancieres: true,
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
    appelOffre: { ...fakeProject.appelOffre, soumisAuxGarantiesFinancieres: false },
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
