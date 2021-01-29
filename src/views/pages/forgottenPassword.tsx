import React from 'react'

import { dataId } from '../../helpers/testId'
import { Request } from 'express'
import routes from '../../routes'

interface Props {
  request: Request
}

/* Pure component */
export default function ForgottenPasswordPage({ request }: Props) {
  const { error, success } = request.query || {}
  return (
    <main role="main">
      <section className="section section-grey">
        <div className="container">
          <form action={routes.FORGOTTEN_PASSWORD_ACTION} method="post" name="form">
            <h3>J'ai oublié mon mot de passe</h3>
            {error ? (
              <div className="notification error" {...dataId('error-message')}>
                {error}
              </div>
            ) : (
              ''
            )}
            {success ? (
              <>
                <div className="notification success" {...dataId('success-message')}>
                  {success}
                </div>
              </>
            ) : (
              ''
            )}
            <div className="form__group">
              <label htmlFor="email">Courrier électronique</label>
              <input type="email" name="email" id="email" {...dataId('email-field')} />
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                {...dataId('submit-button')}
              >
                Je demande à renouveller mon mot de passe
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
