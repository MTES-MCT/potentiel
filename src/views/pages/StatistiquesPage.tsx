import type { Request } from 'express'
import React from 'react'
import { PageTemplate } from '@components'
import { hydrateOnClient } from '../helpers'

type StatistiquesProps = {
  request: Request
  mainIframeUrl: string
  mapIframeUrl: string
}

export const Statistiques = ({ mapIframeUrl, mainIframeUrl, request }: StatistiquesProps) => {
  return (
    <PageTemplate user={request.user}>
      <main role="main">
        <section className="section section-color">
          <div className="container">
            <h2 className="section__title">Potentiel en chiffres</h2>
            <p className="section__subtitle">Au service des porteurs de projets</p>
          </div>
        </section>
        <section className="section section-white" style={{ paddingTop: 0 }}>
          <script src="https://metabase.potentiel.beta.gouv.fr/app/iframeResizer.js"></script>
          <div
            className="container"
            dangerouslySetInnerHTML={{
              __html: `<iframe
            src="${mainIframeUrl}"
            frameBorder="0"
            width="100%"
            allowTransparency
            onload="iFrameResize({}, this)"
          ></iframe>`,
            }}
          ></div>
          <div
            className="container"
            dangerouslySetInnerHTML={{
              __html: `<iframe
            src="${mapIframeUrl}"
            frameBorder="0"
            width="100%"
            allowTransparency
            onload="iFrameResize({}, this)"
          ></iframe>`,
            }}
          ></div>
        </section>
      </main>
    </PageTemplate>
  )
}

hydrateOnClient(Statistiques)
