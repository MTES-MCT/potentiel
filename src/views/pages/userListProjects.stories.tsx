import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'

import UserListProjects from './userListProjects'

export default { title: 'User Dashboard' }

export const empty = () => <UserListProjects request={makeFakeRequest()} />

export const withError = () => (
  <UserListProjects
    request={makeFakeRequest({
      query: { error: 'This is an error message!' }
    })}
  />
)

export const withSuccess = () => (
  <UserListProjects
    request={makeFakeRequest({
      query: { success: 'This is a success message!' }
    })}
  />
)

export const withProjects = () => (
  <UserListProjects
    request={makeFakeRequest()}
    projects={[
      makeFakeProject(),
      makeFakeProject({ classe: 'Classé', motifsElimination: null })
    ]}
  />
)
