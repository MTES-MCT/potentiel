import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import DrealList from './drealList'

export default { title: 'Inviter une DREAL' }

export const withError = () => (
  <DrealList
    users={[]}
    invitations={[]}
    request={makeFakeRequest({ query: { error: 'This is an error message!' } })}
  />
)

export const withSuccess = () => (
  <DrealList
    users={[]}
    invitations={[]}
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
  />
)

export const withUsers = () => <DrealList users={[]} invitations={[]} request={makeFakeRequest()} />
