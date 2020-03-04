import React from 'react'

/* Pure component */
export default function LoginPage({
  hasError = false
}: { hasError?: boolean } = {}) {
  return (
    <main role="main">
      <section className="section section-grey">
        <div className="container">
          <form action="/login" method="post" name="form">
            <h3 id="login">Je m'identifie</h3>
            {hasError ? (
              <div className="notification error">
                Identifiant ou mot de passe erroné.
              </div>
            ) : (
              ''
            )}
            <div className="form__group">
              <label htmlFor="email">Courrier électronique</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="jean.martin@example.com"
                value="test@test.com"
              />
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="*******"
                value="test"
              />
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
              >
                Je m'identifie
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
