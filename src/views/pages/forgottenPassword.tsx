import React from 'react'

import { dataId } from '../../helpers/testId'
import { HttpRequest } from '../../types'
import routes from '../../routes'

interface Props {
  request: HttpRequest
}

/* Pure component */
export default function ForgottenPasswordPage({ request }: Props) {
  const { error, success } = request.query || {}
  return (
    <main role="main">
      <section className="section section-grey">
        <div className="container">
          <form
            action={routes.FORGOTTEN_PASSWORD_ACTION}
            method="post"
            name="form"
          >
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
                <div
                  className="notification success"
                  {...dataId('success-message')}
                >
                  {success}
                </div>
                <div
                  className="notification warning"
                  {...dataId('error-message')}
                >
                  Certains utilisateurs nous ont signalé des temps de réception
                  des mails parfois longs. N'hésitez pas à nous contacter si
                  vous n'avez pas reçu le mail de recupération de mot de passe
                  d'ici 48h. Merci de votre compréhension.
                </div>
              </>
            ) : (
              ''
            )}
            <div className="form__group">
              <label htmlFor="email">Courrier électronique</label>
              <input
                type="email"
                name="email"
                id="email"
                {...dataId('email-field')}
              />
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
