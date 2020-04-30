import React from 'react'

import { dataId } from '../../helpers/testId'
import { HttpRequest } from '../../types'
import routes from '../../routes'

interface Props {
  request: HttpRequest
}

/* Pure component */
export default function ResetPasswordPage({ request }: Props) {
  const { error, success, resetCode } = request.query || {}
  return (
    <main role="main">
      <section className="section section-grey">
        <div className="container">
          <form action={routes.RESET_PASSWORD_ACTION} method="post" name="form">
            <h3>Changer mon mot de passe</h3>
            {error ? <div className="notification error">{error}</div> : ''}
            {success ? (
              <div className="notification success">{success}</div>
            ) : (
              ''
            )}
            <div className="form__group">
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                type="password"
                name="password"
                id="password"
                {...dataId('password-field')}
              />
              <label htmlFor="confirmPassword">Confirmer mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                {...dataId('confirm-password-field')}
              />
              <input
                type="hidden"
                name="resetCode"
                id="resetCode"
                value={resetCode || ''}
              />
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                {...dataId('submit-button')}
              >
                Changer mon mot de passe
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
