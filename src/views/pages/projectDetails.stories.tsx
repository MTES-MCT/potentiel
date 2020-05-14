import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import ProjectDetails from './projectDetails'

export default { title: 'Project page' }

import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
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
    projectInvitations={[{ email: 'invited@email.com' }]}
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
    projectInvitations={[{ email: 'invited@email.com' }]}
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
    })}
    projectUsers={[makeFakeUser()]}
    projectInvitations={[{ email: 'invited@email.com' }]}
  />
)
