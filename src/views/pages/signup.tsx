import React from 'react'

import ROUTES from '../../routes'

interface SignupProps {
  error?: string
  projectAdmissionKey?: string
  projectId?: string
}

/* Pure component */
export default function SignupPage({
  error,
  projectAdmissionKey,
  projectId
}: SignupProps) {
  return (
    <main role="main">
      <section className="section section-grey">
        <div className="container">
          <form action={ROUTES.SIGNUP_ACTION} method="post" name="form">
            <h3 id="login">Je crée mon compte porteur de projet</h3>
            {error ? <div className="notification error">{error}</div> : ''}
            <div className="form__group">
              {projectAdmissionKey && projectId ? (
                <>
                  <input
                    type="hidden"
                    name="projectAdmissionKey"
                    id="projectAdmissionKey"
                    value={projectAdmissionKey}
                  />
                  <input
                    type="hidden"
                    name="projectId"
                    id="projectId"
                    value={projectId}
                  />
                </>
              ) : (
                ''
              )}
              <label htmlFor="lastName">Nom</label>
              <input type="text" name="lastName" id="lastName" />
              <label htmlFor="firstName">Prénom</label>
              <input type="text" name="firstName" id="firstName" />
              <label htmlFor="email">Courrier électronique</label>
              <input type="email" name="email" id="email" />
              <label htmlFor="password">Mot de passe</label>
              <input type="password" name="password" id="password" />
              <label htmlFor="confirmPassword">Confirmer mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
              />
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
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
