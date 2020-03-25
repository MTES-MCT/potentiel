import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeCandidateNotification from '../../__tests__/fixtures/candidateNotification'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import AdminDashboard from './adminDashboard'

export default { title: 'Admin Dashboard' }

export const empty = () => <AdminDashboard request={makeFakeRequest()} />

export const withError = () => (
  <AdminDashboard
    request={makeFakeRequest({ query: { error: 'This is an error message!' } })}
  />
)

export const withSuccess = () => (
  <AdminDashboard
    request={makeFakeRequest({
      query: { success: 'This is a success message!' }
    })}
  />
)

export const withProjects = () => (
  <AdminDashboard
    request={makeFakeRequest()}
    projects={[
      makeFakeProject({
        candidateNotifications: [
          makeFakeCandidateNotification({ template: 'elimination' })
        ]
      }),
      makeFakeProject({
        classe: 'Classé',
        candidateNotifications: [makeFakeCandidateNotification()]
      }),
      makeFakeProject({
        classe: 'Classé'
      })
    ]}
  />
)
