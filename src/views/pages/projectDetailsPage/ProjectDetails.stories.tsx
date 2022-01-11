import React from 'react'
import { ProjectDetails } from './ProjectDetails'
import { appelsOffreStatic } from '../../../dataAccess/inMemory/appelOffre'
import { ProjectAppelOffre } from '../../../entities'
import { ProjectDataForProjectPage } from '../../../modules/project/dtos'
import makeFakeRequest from '../../../__tests__/fixtures/request'
import makeFakeUser from '../../../__tests__/fixtures/user'

export default { title: 'Project page' }

const appelOffre: ProjectAppelOffre | undefined = appelsOffreStatic.find(
  (appelOffre) => appelOffre.id === 'Fessenheim'
) as ProjectAppelOffre
if (appelOffre) appelOffre.periode = appelOffre.periodes[1]

const fakeProjectData = ({
  id: 'projectId',

  appelOffreId: 'Fessenheim',
  periodeId: '1',
  familleId: 'familleId',
  numeroCRE: 'numeroCRE',
  appelOffre,

  puissance: 123,
  prixReference: 456,

  engagementFournitureDePuissanceAlaPointe: false,
  isFinancementParticipatif: false,
  isInvestissementParticipatif: true,

  adresseProjet: 'adresse',
  codePostalProjet: '12345',
  communeProjet: 'communeProjet',
  departementProjet: 'departementProjet',
  regionProjet: 'regionProjet',
  territoireProjet: 'territoireProjet',

  nomProjet: 'nomProjet',
  nomCandidat: 'nomCandidat',
  nomRepresentantLegal: 'representantLegal',
  email: 'test@test.test',
  fournisseur: 'fournisseur',
  evaluationCarbone: 132,
  note: 10,

  details: {
    'Note prix': '51,2',
    'Note innovation\n(AO innovation)': '45,222225',
    'Note degré d’innovation (/20pt)\n(AO innovation)': '19',
    'Note positionnement sur le marché (/10pt)\n(AO innovation)': '8,3333333334',
    'Note qualité technique (/5pt)\n(AO innovation)': '2,56',
    'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)': '2,555',
    'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)': '2,56',
  },

  notifiedOn: new Date(),

  certificateFile: {
    id: 'certificateFileId',
    filename: 'filename',
  },

  isClasse: true,

  motifsElimination: 'motifsElimination',

  users: [],
  invitations: [],
} as unknown) as ProjectDataForProjectPage

export const forAdminsLaureat = () => (
  <ProjectDetails
    now={new Date().getTime()}
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    project={
      {
        ...fakeProjectData,
        isClasse: true,
      } as ProjectDataForProjectPage
    }
  />
)

export const forAdminsElimine = () => (
  <ProjectDetails
    now={new Date().getTime()}
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    project={
      {
        ...fakeProjectData,
        isClasse: false,
      } as ProjectDataForProjectPage
    }
  />
)

export const forAdminsNonNotifié = () => (
  <ProjectDetails
    now={new Date().getTime()}
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    project={
      {
        ...fakeProjectData,
        isClasse: false,
        notifiedOn: undefined,
      } as ProjectDataForProjectPage
    }
  />
)

const MONTHS = 1000 * 3600 * 24 * 30

export const forPorteurProjet = () => (
  <ProjectDetails
    now={new Date().getTime()}
    request={makeFakeRequest({
      user: makeFakeUser({ role: 'porteur-projet' }),
    })}
    project={
      {
        ...fakeProjectData,
        isClasse: true,
        dcr: { dueOn: new Date(Date.now() + 2 * MONTHS) },
        garantiesFinancieres: { dueOn: new Date(Date.now() + 2 * MONTHS) },
      } as ProjectDataForProjectPage
    }
  />
)

export const forPorteurProjetWithGarantiesFinancieres = () => (
  <ProjectDetails
    now={new Date().getTime()}
    request={makeFakeRequest({
      user: makeFakeUser({ role: 'porteur-projet' }),
    })}
    project={
      {
        ...fakeProjectData,
        isClasse: true,
        dcr: { dueOn: new Date(Date.now() + 2 * MONTHS) },
        garantiesFinancieres: {
          dueOn: new Date(Date.now() + 2 * MONTHS),
          submittedOn: new Date(),
          file: { id: 'fileId', filename: 'fichier' },
        },
      } as ProjectDataForProjectPage
    }
  />
)

export const forPorteurProjetWithPTF = () => (
  <ProjectDetails
    now={new Date().getTime()}
    request={makeFakeRequest({
      user: makeFakeUser({ role: 'porteur-projet' }),
    })}
    project={
      {
        ...fakeProjectData,
        isClasse: true,
        ptf: {
          submittedOn: new Date(),
          ptfDate: new Date(),
          file: {
            id: 'fileId',
            filename: 'filename.pdf',
          },
        },
      } as ProjectDataForProjectPage
    }
  />
)

export const forPorteurProjetWithSuccess = () => (
  <ProjectDetails
    now={new Date().getTime()}
    request={makeFakeRequest({
      user: makeFakeUser({ role: 'porteur-projet' }),
      query: { success: 'Une invitation a bien été envoyée' },
    })}
    project={fakeProjectData}
  />
)

export const forDrealGFPassDue = () => (
  <ProjectDetails
    now={new Date().getTime()}
    request={makeFakeRequest({
      user: makeFakeUser({ role: 'dreal' }),
    })}
    project={
      {
        ...fakeProjectData,
        isClasse: true,
        garantiesFinancieres: { dueOn: new Date(Date.now() - 2 * MONTHS) },
      } as ProjectDataForProjectPage
    }
  />
)

export const forDrealGFStillDue = () => (
  <ProjectDetails
    now={new Date().getTime()}
    request={makeFakeRequest({
      user: makeFakeUser({ role: 'dreal' }),
    })}
    project={
      {
        ...fakeProjectData,
        isClasse: true,
        garantiesFinancieres: { dueOn: new Date(Date.now() + 2 * MONTHS) },
      } as ProjectDataForProjectPage
    }
  />
)

const appelOffreInnovation: ProjectAppelOffre = appelsOffreStatic.find(
  (appelOffre) => appelOffre.id === 'CRE4 - Innovation'
) as ProjectAppelOffre

if (appelOffreInnovation) {
  appelOffreInnovation.periode = appelOffreInnovation.periodes[1]
}

export const forAOInnovation = () => (
  <ProjectDetails
    now={new Date().getTime()}
    request={makeFakeRequest({
      user: makeFakeUser({ role: 'porteur-projet' }),
    })}
    project={{
      ...fakeProjectData,
      appelOffre: appelOffreInnovation,
      note: 6.3,
      details: {
        'Note prix': '51,2',
        'Note innovation\n(AO innovation)': '45,222225',
        'Note degré d’innovation (/20pt)\n(AO innovation)': '19',
        'Note positionnement sur le marché (/10pt)\n(AO innovation)': '8,3333333334',
        'Note qualité technique (/5pt)\n(AO innovation)': '2,56',
        'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)':
          '2,555',
        'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)': '2,56',
      },
    }}
  />
)
