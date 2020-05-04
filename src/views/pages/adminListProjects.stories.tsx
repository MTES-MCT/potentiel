import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeCandidateNotification from '../../__tests__/fixtures/candidateNotification'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import AdminListProjects from './adminListProjects'

export default { title: 'Admin List Projects' }

import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'

export const empty = () => (
  <AdminListProjects
    request={makeFakeRequest()}
    projects={[]}
    appelsOffre={appelsOffreStatic}
  />
)

export const withError = () => (
  <AdminListProjects
    request={makeFakeRequest({
      query: { error: 'This is an error message!' },
    })}
    projects={[]}
    appelsOffre={appelsOffreStatic}
  />
)

export const withSuccess = () => (
  <AdminListProjects
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
    projects={[]}
    appelsOffre={appelsOffreStatic}
  />
)

export const withProjects = () => (
  <AdminListProjects
    request={makeFakeRequest()}
    appelsOffre={appelsOffreStatic}
    projects={[
      makeFakeProject({
        candidateNotifications: [
          makeFakeCandidateNotification({ template: 'elimination' }),
        ],
      }),
      makeFakeProject({
        classe: 'Classé',
        candidateNotifications: [makeFakeCandidateNotification()],
      }),
      makeFakeProject({
        classe: 'Classé',
      }),
    ]}
  />
)
