import React from 'react'

import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeRequest from '../../../__tests__/fixtures/request'

import {NewModificationRequest} from './NewModificationRequest'

export default { title: 'Modification Request' }

// export const empty = () => <ModificationRequestPage />

// export const withError = () => (
//   <ModificationRequestPage error="This is an error message!" />
// )

// export const withSuccess = () => (
//   <ModificationRequestPage success="This is a success message!" />
// )

export const Fournisseur = () => (
  <NewModificationRequest
    request={makeFakeRequest({ query: { action: 'fournisseur' } })}
    project={makeFakeProject()}
  />
)

export const Délais = () => (
  <NewModificationRequest
    request={makeFakeRequest({ query: { action: 'delais' } })}
    project={makeFakeProject()}
  />
)

export const Actionnaire = () => (
  <NewModificationRequest
    request={makeFakeRequest({ query: { action: 'actionnaire' } })}
    project={makeFakeProject()}
  />
)

export const Puissance = () => (
  <NewModificationRequest
    request={makeFakeRequest({ query: { action: 'puissance' } })}
    project={makeFakeProject()}
  />
)

export const Abandon = () => (
  <NewModificationRequest
    request={makeFakeRequest({ query: { action: 'abandon' } })}
    project={makeFakeProject()}
  />
)

export const Recours = () => (
  <NewModificationRequest
    request={makeFakeRequest({ query: { action: 'recours' } })}
    project={makeFakeProject()}
  />
)
