import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'

import UserDashboard from './userDashboard'

export default { title: 'User Dashboard' }

export const empty = () => <UserDashboard />

export const withError = () => (
  <UserDashboard error="This is an error message!" />
)

export const withSuccess = () => (
  <UserDashboard success="This is a success message!" />
)

export const withProjects = () => (
  <UserDashboard
    projects={[
      makeFakeProject(),
      makeFakeProject({ classe: 'Classé', motifsElimination: null })
    ]}
  />
)
