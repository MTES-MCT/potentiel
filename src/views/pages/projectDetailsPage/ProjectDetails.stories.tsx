import React from 'react'
import { ProjectDetails } from './ProjectDetails'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import { ProjectAppelOffre } from '@entities'
import { ProjectDataForProjectPage } from '@modules/project/dtos'
import makeFakeRequest from '../../../__tests__/fixtures/request'
import makeFakeUser from '../../../__tests__/fixtures/user'
import {
  ProjectImportedDTO,
  ProjectNotifiedDTO,
  ProjectCertificateGeneratedDTO,
  ProjectGFDueDateSetDTO,
  ProjectDCRDueDateSetDTO,
  ProjectPTFSubmittedDTO,
  ProjectCompletionDueDateSetDTO,
  ProjectEventListDTO,
} from '@modules/frise'

export default { title: 'Project page' }

const appelOffre: ProjectAppelOffre | undefined = appelsOffreStatic.find(
  (appelOffre) => appelOffre.id === 'Fessenheim'
) as ProjectAppelOffre
if (appelOffre) appelOffre.periode = appelOffre.periodes[1]

const projectEventList: ProjectEventListDTO = {
  project: { id: 'fake-project-id', status: 'Classé' },
  events: [
    {
      type: 'ProjectImported',
      variant: 'admin',
      date: new Date('2022-01-11').getTime(),
    } as ProjectImportedDTO,
    {
      type: 'ProjectNotified',
      variant: 'admin',
      date: new Date('2022-01-12').getTime(),
    } as ProjectNotifiedDTO,
    {
      type: 'ProjectCompletionDueDateSet',
      variant: 'admin',
      date: new Date('2024-01-12').getTime(),
    } as ProjectCompletionDueDateSetDTO,
    {
      type: 'ProjectCertificateGenerated',
      variant: 'admin',
      date: new Date('2022-01-13').getTime(),
      certificateFileId: 'file-id',
      nomProjet: 'mon projet pv',
      email: 'porteur@test.test',
      potentielIdentifier: 'pot-id',
    } as ProjectCertificateGeneratedDTO,
    {
      type: 'ProjectGFDueDateSet',
      variant: 'admin',
      date: new Date('2022-01-13').getTime(),
    } as ProjectGFDueDateSetDTO,
    {
      type: 'ProjectDCRDueDateSet',
      variant: 'admin',
      date: new Date('2022-02-13').getTime(),
    } as ProjectDCRDueDateSetDTO,
  ],
}

const fakeProjectData = {
  id: 'projectId',
  potentielIdentifier: 'potentielIdentifier',

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

  contratEDF: {
    numero: 'ABCDEFG',
    type: 'FV16BCR',
    dateEffet: '1/1/20',
    dateSignature: '3/23/21',
    dateMiseEnService: '3/1/22',
    duree: 7303,
    statut: 'SIGNE',
  },
} as unknown as ProjectDataForProjectPage

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
    projectEventList={projectEventList}
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
    projectEventList={projectEventList}
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
    projectEventList={projectEventList}
  />
)

export const forAdminsAbandonné = () => (
  <ProjectDetails
    now={new Date().getTime()}
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    project={
      {
        ...fakeProjectData,
        isClasse: false,
        isAbandoned: true,
      } as ProjectDataForProjectPage
    }
    projectEventList={projectEventList}
  />
)

const MONTHS = 1000 * 3600 * 24 * 30

export const forPorteurProjet = () => (
  <ProjectDetails
    projectEventList={projectEventList}
    cahiersChargesURLs={{ oldCahierChargesURL: 'string', newCahierChargesURL: 'string' }}
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

export const forPorteurProjetElimine = () => (
  <ProjectDetails
    projectEventList={projectEventList}
    cahiersChargesURLs={{ oldCahierChargesURL: 'string', newCahierChargesURL: 'string' }}
    now={new Date().getTime()}
    request={makeFakeRequest({
      user: makeFakeUser({ role: 'porteur-projet' }),
    })}
    project={
      {
        ...fakeProjectData,
        isClasse: false,
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
    projectEventList={projectEventList}
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
    projectEventList={{
      ...projectEventList,
      events: [
        ...projectEventList.events,
        {
          type: 'ProjectPTFSubmitted',
          variant: 'porteur-projet',
          date: new Date('2022-02-13').getTime(),
        } as ProjectPTFSubmittedDTO,
      ],
    }}
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
    projectEventList={projectEventList}
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
    projectEventList={projectEventList}
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
    projectEventList={projectEventList}
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
    projectEventList={projectEventList}
  />
)
