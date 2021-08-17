import React from 'react'

import { dataId } from '../../helpers/testId'

import ROUTES from '../../routes'
import { Request } from 'express'
import { ProjectAdmissionKey } from '../../entities'

interface SignupProps {
  request: Request
  projectAdmissionKey: ProjectAdmissionKey
}

/* Pure component */
export default function SignupPage({ request, projectAdmissionKey }: SignupProps) {
  const { error } = (request.query as any) || {}

  const { fullName, email, dreal, projectId, forRole } = projectAdmissionKey

  return (
    <main role="main">
      <section className="section section-grey">
        <div className="container">
          <form action={ROUTES.SIGNUP_ACTION} method="post" name="form" {...dataId('signup-form')}>
            <h3 id="login">Je crée mon compte</h3>
            {error ? <div className="notification error">{error}</div> : ''}
            <div className="form__group">
              {projectAdmissionKey ? (
                <>
                  <input
                    type="hidden"
                    name="projectAdmissionKey"
                    id="projectAdmissionKey"
                    value={projectAdmissionKey.id}
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
                {...dataId('fullName-field')}
                defaultValue={fullName}
              />
              <label htmlFor="email">Courrier électronique</label>
              <input
                type="email"
                name="email"
                id="email"
                {...dataId('email-field')}
                defaultValue={email}
                disabled={!dreal}
              />
              {!projectId && !dreal && !forRole ? (
                // Only display this warning if it's an email notification
                // if projectAdmissionKey has a projectId, it's an email invitation coming from another user
                <div className="notification warning">
                  Il s'agit de l'adresse électronique que vous avez renseigné sur votre dossier de
                  candidature. Vous pourrez la changer par la suite.
                </div>
              ) : (
                ''
              )}
              <label htmlFor="password">Mot de passe</label>
              <input type="password" name="password" id="password" {...dataId('password-field')} />
              <label htmlFor="confirmPassword">Confirmer mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                {...dataId('confirm-password-field')}
              />
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                {...dataId('submit-button')}
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
