import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import ProjectDetails from './projectDetails'

export default { title: 'Project page' }

import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { ProjectAdmissionKey } from '../../entities'
const appelOffre = appelsOffreStatic.find(
  (appelOffre) => appelOffre.id === 'Fessenheim'
)
if (appelOffre) appelOffre.periode = appelOffre.periodes[1]

export const forAdminsLaureat = () => (
  <ProjectDetails
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    project={makeFakeProject({
      id: 'projectId',
      classe: 'Classé',
      notifiedOn: Date.now(),
      appelOffre,
    })}
    projectUsers={[makeFakeUser()]}
    projectInvitations={[
      { id: 'admissionKey', email: 'invited@email.com' } as ProjectAdmissionKey,
    ]}
  />
)

export const forAdminsNoAccess = () => (
  <ProjectDetails
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    project={makeFakeProject({
      id: 'projectId',
      classe: 'Classé',
      notifiedOn: Date.now(),
      appelOffre,
    })}
    projectUsers={[]}
    projectInvitations={[]}
  />
)

export const forAdminsElimine = () => (
  <ProjectDetails
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    project={makeFakeProject({
      id: 'projectId',
      classe: 'Eliminé',
      notifiedOn: Date.now(),
      appelOffre,
    })}
    projectUsers={[makeFakeUser()]}
    projectInvitations={[]}
  />
)

export const forAdminsNonNotifié = () => (
  <ProjectDetails
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    project={makeFakeProject({
      id: 'projectId',
      classe: 'Eliminé',
      notifiedOn: 0,
      appelOffre,
    })}
    projectUsers={[]}
    projectInvitations={[]}
  />
)

export const forPorteurProjet = () => (
  <ProjectDetails
    request={makeFakeRequest({
      user: makeFakeUser({ role: 'porteur-projet' }),
    })}
    project={makeFakeProject({
      id: 'projectId',
      classe: 'Classé',
      notifiedOn: Date.now(),
      appelOffre,
      details: {
        'Note blabla': '9,6',
      },
    })}
    projectUsers={[makeFakeUser()]}
    projectInvitations={[
      {
        id: 'admissionKey',
        email: 'invited@email.com',
      } as ProjectAdmissionKey,
    ]}
  />
)

const appelOffreInnovation = appelsOffreStatic.find(
  (appelOffre) => appelOffre.id === 'CRE4 - Innovation'
)
if (appelOffreInnovation)
  appelOffreInnovation.periode = appelOffreInnovation.periodes[1]
export const forAOInnovation = () => (
  <ProjectDetails
    request={makeFakeRequest({
      user: makeFakeUser({ role: 'porteur-projet' }),
    })}
    project={makeFakeProject({
      id: 'projectId',
      classe: 'Classé',
      notifiedOn: Date.now(),
      appelOffre: appelOffreInnovation,
      note: 6.3,
      details: {
        'Note prix': '51,2',
        'Note innovation\n(AO innovation)': '45,222225',
        'Note degré d’innovation (/20pt)\n(AO innovation)': '19',
        'Note positionnement sur le marché (/10pt)\n(AO innovation)':
          '8,3333333334',
        'Note qualité technique (/5pt)\n(AO innovation)': '2,56',
        'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)':
          '2,555',
        'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)':
          '2,56',
      },
    })}
    projectUsers={[makeFakeUser()]}
    projectInvitations={[
      {
        id: 'admissionKey',
        email: 'invited@email.com',
      } as ProjectAdmissionKey,
    ]}
  />
)
