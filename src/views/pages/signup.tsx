import React from 'react'

import { dataId } from '../../helpers/testId'

import ROUTES from '../../routes'
import { HttpRequest } from '../../types'

interface SignupProps {
  request: HttpRequest
}

/* Pure component */
export default function SignupPage({ request }: SignupProps) {
  const { error, projectAdmissionKey, fullName, email } = request.query || {}
  return (
    <main role="main">
      <section className="section section-grey">
        <div className="container">
          <form
            action={ROUTES.SIGNUP_ACTION}
            method="post"
            name="form"
            {...dataId('signup-form')}
          >
            <h3 id="login">Je crée mon compte porteur de projet</h3>
            {error ? <div className="notification error">{error}</div> : ''}
            <div className="form__group">
              {projectAdmissionKey ? (
                <>
                  <input
                    type="hidden"
                    name="projectAdmissionKey"
                    id="projectAdmissionKey"
                    value={projectAdmissionKey}
                  />
                </>
              ) : (
                ''
              )}
              <label htmlFor="fullName">Noms, Prénoms</label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                {...dataId('signup-fullName-field')}
                value={fullName}
              />
              <label htmlFor="email">Courrier électronique</label>
              <div className="notification warning">
                Il s'agit de l'adresse électronique que vous avez renseigné sur
                votre dossier de candidature. Vous pourrez la changer par la
                suite.
              </div>
              <input
                type="email"
                name="email"
                id="email"
                {...dataId('signup-email-field')}
                value={email}
                disabled
              />
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                name="password"
                id="password"
                {...dataId('signup-password-field')}
              />
              <label htmlFor="confirmPassword">Confirmer mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                {...dataId('signup-confirm-password-field')}
              />
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                {...dataId('signup-submit-button')}
              >
                Envoyer
              </button>
              {/* <p>
                <a href="/mot-de-passe-oublie">J'ai oublié mon mot de passe</a>
              </p> */}
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
