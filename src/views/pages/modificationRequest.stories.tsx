import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'

import ModificationRequestPage from './modificationRequest'

export default { title: 'Modification Request' }

// export const empty = () => <ModificationRequestPage />

// export const withError = () => (
//   <ModificationRequestPage error="This is an error message!" />
// )

// export const withSuccess = () => (
//   <ModificationRequestPage success="This is a success message!" />
// )

export const Fournisseur = () => (
  <ModificationRequestPage action="fournisseur" project={makeFakeProject()} />
)

export const Délais = () => (
  <ModificationRequestPage action="delais" project={makeFakeProject()} />
)

export const Actionnaire = () => (
  <ModificationRequestPage action="actionnaire" project={makeFakeProject()} />
)

export const Puissance = () => (
  <ModificationRequestPage action="puissance" project={makeFakeProject()} />
)

export const Abandon = () => (
  <ModificationRequestPage action="abandon" project={makeFakeProject()} />
)
