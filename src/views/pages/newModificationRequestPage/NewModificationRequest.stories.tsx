import React from 'react'
import { batimentPPE2 } from 'src/dataAccess/inMemory/appelsOffres'

import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeRequest from '../../../__tests__/fixtures/request'

import { NewModificationRequest } from './NewModificationRequest'

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
    request={makeFakeRequest({ query: { action: 'delai' } })}
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

export const PuissanceMaxVolumeReserve1MW = () => (
  <NewModificationRequest
    request={makeFakeRequest({ query: { action: 'puissance' } })}
    project={makeFakeProject({
      appelOffre: { ...batimentPPE2, periode: batimentPPE2.periodes[0] },
      puissance: 0.6,
      puissanceInitiale: 0.6,
    })}
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
