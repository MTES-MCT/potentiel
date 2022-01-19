import React from 'react'
import makeFakeRequest from '../../__tests__/fixtures/request'
import ImportCandidates from './importCandidates'

// This is static
import { appelsOffreStatic } from '@dataAccess/inMemory'

export default { title: 'Import Candidates' }

export const empty = () => <ImportCandidates request={makeFakeRequest()} />

export const withError = () => (
  <ImportCandidates request={makeFakeRequest({ query: { error: 'This is an error message!' } })} />
)

export const withSuccess = () => (
  <ImportCandidates
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
  />
)
