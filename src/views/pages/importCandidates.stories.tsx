import React from 'react'
import makeFakeRequest from '../../__tests__/fixtures/request'
import ImportCandidates from './importCandidates'

// This is static
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'

export default { title: 'Import Candidates' }

export const empty = () => (
  <ImportCandidates
    appelsOffre={appelsOffreStatic}
    request={makeFakeRequest()}
  />
)

export const withError = () => (
  <ImportCandidates
    appelsOffre={appelsOffreStatic}
    request={makeFakeRequest({ query: { error: 'This is an error message!' } })}
  />
)

export const withSuccess = () => (
  <ImportCandidates
    appelsOffre={appelsOffreStatic}
    request={makeFakeRequest({
      query: { success: 'This is a success message!' }
    })}
  />
)
