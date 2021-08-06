import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import ForgottenPassword from './forgottenPassword'

export default { title: 'Mot de passe oublié' }

export const Empty = () => <ForgottenPassword request={makeFakeRequest()} />
export const withError = () => (
  <ForgottenPassword request={makeFakeRequest({ query: { error: 'This is an error message!' } })} />
)

export const withSuccess = () => (
  <ForgottenPassword
    request={makeFakeRequest({
      query: {
        success:
          "Si l'adresse saisie correspond bien à un compte Potentiel, vous recevrez un courrier électronique avec des instructions pour choisir un nouveau mot de passe.",
      },
    })}
  />
)
