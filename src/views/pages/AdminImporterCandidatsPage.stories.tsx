import React from 'react'
import makeFakeRequest from '../../__tests__/fixtures/request'
import { AdminImporterCandidats } from './AdminImporterCandidatsPage'

// This is static

export default { title: 'Import Candidates' }

export const empty = () => <AdminImporterCandidats request={makeFakeRequest()} />

export const withError = () => (
  <AdminImporterCandidats
    request={makeFakeRequest({ query: { error: 'This is an error message!' } })}
  />
)

export const withSuccess = () => (
  <AdminImporterCandidats
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
  />
)
