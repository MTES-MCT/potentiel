import React from 'react'
import makeFakeRequest from '../../__tests__/fixtures/request'
import AdminRegenerateCertificates from './adminRegenerateCertificates'

export default { title: 'Admin: Regénérer les attestations' }

export const empty = () => <AdminRegenerateCertificates request={makeFakeRequest()} />

export const withError = () => (
  <AdminRegenerateCertificates
    request={makeFakeRequest({ query: { error: 'This is an error message!' } })}
  />
)

export const withSuccess = () => (
  <AdminRegenerateCertificates
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
  />
)
