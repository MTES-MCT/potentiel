import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'

import UserDashboard from './userDashboard'

export default { title: 'User Dashboard' }

export const empty = () => <UserDashboard request={makeFakeRequest()} />

export const withError = () => (
  <UserDashboard
    request={makeFakeRequest({
      query: { error: 'This is an error message!' }
    })}
  />
)

export const withSuccess = () => (
  <UserDashboard
    request={makeFakeRequest({
      query: { success: 'This is a success message!' }
    })}
  />
)

export const withProjects = () => (
  <UserDashboard
    request={makeFakeRequest()}
    projects={[
      makeFakeProject(),
      makeFakeProject({ classe: 'Classé', motifsElimination: null })
    ]}
  />
)
