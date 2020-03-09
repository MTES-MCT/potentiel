import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeCandidateNotification from '../../__tests__/fixtures/candidateNotification'

import AdminDashboard from './adminDashboard'

export default { title: 'Admin Dashboard' }

export const empty = () => <AdminDashboard />

export const withError = () => (
  <AdminDashboard error="This is an error message!" />
)

export const withSuccess = () => (
  <AdminDashboard success="This is a success message!" />
)

export const withProjects = () => (
  <AdminDashboard
    projects={[
      makeFakeProject({
        candidateNotifications: [
          makeFakeCandidateNotification({ template: 'elimination' })
        ]
      }),
      makeFakeProject({
        classe: 'Classé',
        candidateNotifications: [makeFakeCandidateNotification()]
      })
    ]}
  />
)
