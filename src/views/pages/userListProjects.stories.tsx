import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'

import UserListProjects from './userListProjects'

export default { title: 'User Dashboard' }

import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'

export const empty = () => (
  <UserListProjects request={makeFakeRequest()} projects={[]} />
)

export const withError = () => (
  <UserListProjects
    request={makeFakeRequest({
      query: { error: 'This is an error message!' },
    })}
    projects={[]}
  />
)

export const withSuccess = () => (
  <UserListProjects
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
    projects={[]}
  />
)

export const withProjects = () => (
  <UserListProjects
    request={makeFakeRequest()}
    projects={[
      makeFakeProject(),
      makeFakeProject({ classe: 'Classé', motifsElimination: null }),
    ]}
  />
)
