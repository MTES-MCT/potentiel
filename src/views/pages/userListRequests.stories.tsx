import React from 'react'

import makeFakeModificationRequest from '../../__tests__/fixtures/modificationRequest'
import makeFakeRequest from '../../__tests__/fixtures/request'

import UserListRequests from './userListRequests'

export default { title: 'Liste de demandes' }

export const empty = () => <UserListRequests request={makeFakeRequest()} />

export const withError = () => (
  <UserListRequests
    request={makeFakeRequest({
      query: { error: 'This is an error message!' }
    })}
  />
)

export const withSuccess = () => (
  <UserListRequests
    request={makeFakeRequest({
      query: { success: 'This is a success message!' }
    })}
  />
)

export const withRequests = () => (
  <UserListRequests
    request={makeFakeRequest()}
    modificationRequests={[
      makeFakeModificationRequest({ status: 'envoyée' }, true),
      makeFakeModificationRequest({ status: 'en instruction' }, true),
      makeFakeModificationRequest({ status: 'en validation' }, true),
      makeFakeModificationRequest({ status: 'validée' }, true),
      makeFakeModificationRequest({ status: 'refusée' }, true)
    ]}
  />
)
