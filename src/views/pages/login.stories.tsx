import React from 'react'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'
import LoginPage from './login'

export default { title: 'Login' }

export const Blank = () => <LoginPage request={makeFakeRequest({ user: undefined })} />

export const WithError = () => {
  return (
    <LoginPage
      request={makeFakeRequest({
        user: undefined,
        query: { email: 'email@test.com', error: 'Une erreur est survenue!' },
      })}
    />
  )
}
