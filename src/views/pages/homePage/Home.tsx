import type { Request } from 'express'
import React from 'react'
import { PageLayout } from '../../components/PageLayout'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'

interface Props {
  request: Request
}

/* Pure component */
export const Home = PageLayout(function (props: Props) {
  return (
    <>
      <div
        className="hero"
        role="banner"
        style={{ background: "url('images/PV.jpg') no-repeat center", backgroundSize: 'cover' }}
      >
        <div className="hero__container text-center">
          <h1 style={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)' }}>
            POTENTIEL
          </h1>
          <p style={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)' }}>
            Faciliter le parcours des producteurs d'énergies renouvelables électriques
          </p>
        </div>
      </div>

      <main role="main">
        <section className="section section-grey" style={{ minHeight: 'calc(100vh - 810px)' }}>
          <div className="container">
            <p className="section__subtitle">
              Potentiel est un nouveau service du ministère de la transition écologique. <br />
              Cette plateforme, en cours de développement, permettra la gestion des projets
              d'énergie renouvelable électrique soutenus par les appels d’offres de l’Etat. <br />
              <a className="button button-primary" style={{ marginTop: '50px' }} href="/login.html">
                Je m'identifie
              </a>
            </p>
          </div>
        </section>
      </main>
    </>
  )
})

hydrateOnClient(Home)
