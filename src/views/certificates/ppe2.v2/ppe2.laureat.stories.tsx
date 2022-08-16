import React from 'react'
import { Font, PDFViewer } from '@react-pdf/renderer'
import { Periode, ProjectAppelOffre } from '@entities'
import { ProjectDataForCertificate } from '@modules/project'
import { makeLaureat } from './components/Laureat'
import { Certificate } from './Certificate'
import {
  autoconsommationMetropolePPE2,
  batimentPPE2,
  eolienPPE2,
  innovationPPE2,
  neutrePPE2,
  solPPE2,
} from '@dataAccess/inMemory/appelsOffres'
import { Signataire } from '..'

export default { title: 'Attestations PDF/PPE2/v2' }

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
  appelOffre: {} as ProjectAppelOffre,
  isClasse: true,
  familleId: 'famille',
  prixReference: 42,
  evaluationCarbone: 42,
  isFinancementParticipatif: false,
  isInvestissementParticipatif: false,
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
  technologie: 'pv',
}

const signataire = {
  fullName: 'Nom du signataire',
  fonction: 'fonction du signataire',
} as Signataire

export const LaureatPPE2AutoconsommationMétropoleFinancementCollectif = () => {
  const project: ProjectDataForCertificate = {
    ...fakeProject,
    actionnariat: 'financement-collectif',
    appelOffre: {
      ...autoconsommationMetropolePPE2,
      periode: autoconsommationMetropolePPE2.periodes[0],
    } as ProjectAppelOffre,
  }
  const { content, footnotes } = makeLaureat(project)

  return (
    <PDFViewer width="100%" height="900px">
      <Certificate {...{ project, type: 'laureat', content, footnotes, signataire }} />
    </PDFViewer>
  )
}

export const LaureatPPE2BatimentGouvernancePartagee = () => {
  const project: ProjectDataForCertificate = {
    ...fakeProject,
    actionnariat: 'gouvernance-partagee',
    appelOffre: {
      ...batimentPPE2,
      periode: batimentPPE2.periodes[0],
    } as ProjectAppelOffre,
  }
  const { content, footnotes } = makeLaureat(project)
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate {...{ project, type: 'laureat', content, footnotes, signataire }} />
    </PDFViewer>
  )
}

export const LaureatPPE2EolienP1 = () => {
  const project = {
    ...fakeProject,
    appelOffre: {
      ...eolienPPE2,
      periode: eolienPPE2.periodes[0],
    } as ProjectAppelOffre,
  }
  const { content, footnotes } = makeLaureat(project)
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate {...{ project, type: 'laureat', content, footnotes, signataire }} />
    </PDFViewer>
  )
}

export const LaureatPPE2EolienP2 = () => {
  const project = {
    ...fakeProject,
    appelOffre: {
      ...eolienPPE2,
      periode: eolienPPE2.periodes[1],
    } as ProjectAppelOffre,
  }
  const { content, footnotes } = makeLaureat(project)
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate {...{ project, type: 'laureat', content, footnotes, signataire }} />
    </PDFViewer>
  )
}

export const LaureatPPE2Innovation = () => {
  const project = {
    ...fakeProject,
    appelOffre: {
      ...innovationPPE2,
      periode: innovationPPE2.periodes[0],
    } as ProjectAppelOffre,
  }
  const { content, footnotes } = makeLaureat(project)
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate {...{ project, type: 'laureat', content, footnotes, signataire }} />
    </PDFViewer>
  )
}

export const LaureatPPE2Neutre = () => {
  const project = {
    ...fakeProject,
    appelOffre: {
      ...neutrePPE2,
      periode: neutrePPE2.periodes[0],
    } as ProjectAppelOffre,
  }
  const { content, footnotes } = makeLaureat(project)
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate {...{ project, type: 'laureat', content, footnotes, signataire }} />
    </PDFViewer>
  )
}

export const LaureatPPE2Sol = () => {
  const project = {
    ...fakeProject,
    appelOffre: {
      ...solPPE2,
      periode: solPPE2.periodes[0],
    } as ProjectAppelOffre,
  }
  const { content, footnotes } = makeLaureat(project)
  return (
    <PDFViewer width="100%" height="900px">
      <Certificate {...{ project, type: 'laureat', content, footnotes, signataire }} />
    </PDFViewer>
  )
}
