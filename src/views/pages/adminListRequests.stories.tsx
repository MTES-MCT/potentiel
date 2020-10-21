import React from 'react'

import makeFakeModificationRequest from '../../__tests__/fixtures/modificationRequest'
import makeFakeRequest from '../../__tests__/fixtures/request'

import AdminListRequests from './adminListRequests'

export default { title: 'Liste de demandes (admin)' }

export const empty = () => <AdminListRequests request={makeFakeRequest()} />

export const withError = () => (
  <AdminListRequests
    request={makeFakeRequest({
      query: { error: 'This is an error message!' }
    })}
  />
)

export const withSuccess = () => (
  <AdminListRequests
    request={makeFakeRequest({
      query: { success: 'This is a success message!' }
    })}
  />
)

export const withRequests = () => (
  <AdminListRequests
    request={makeFakeRequest()}
    modificationRequests={[
      makeFakeModificationRequest({ status: 'envoyée', type: 'recours' }, true),
      makeFakeModificationRequest({ status: 'en instruction' }, true),
      makeFakeModificationRequest({ status: 'en validation' }, true),
      makeFakeModificationRequest({ status: 'validée' }, true),
      makeFakeModificationRequest({ status: 'refusée' }, true)
    ]}
  />
)
