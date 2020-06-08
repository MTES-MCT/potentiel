import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import { ProjectAdmissionKey } from '../../entities'

import Invitationlist from './invitationList'

export default { title: 'Lister les invitations' }

export const withError = () => (
  <Invitationlist
    invitations={{
      items: [] as ProjectAdmissionKey[],
      itemCount: 0,
      pageCount: 0,
      pagination: {
        page: 0,
        pageSize: 10,
      },
    }}
    request={makeFakeRequest({ query: { error: 'This is an error message!' } })}
  />
)

export const withSuccess = () => (
  <Invitationlist
    invitations={{
      items: [] as ProjectAdmissionKey[],
      itemCount: 0,
      pageCount: 0,
      pagination: {
        page: 0,
        pageSize: 10,
      },
    }}
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
  />
)

export const withInvitations = () => (
  <Invitationlist
    invitations={{
      items: [
        {
          id: '1',
          email: 'test@test.com',
          fullName: 'John Doe',
        },
      ] as ProjectAdmissionKey[],
      itemCount: 1,
      pageCount: 1,
      pagination: {
        page: 0,
        pageSize: 10,
      },
    }}
    request={makeFakeRequest()}
  />
)
