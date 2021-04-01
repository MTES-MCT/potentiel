import { Request } from 'express'
import React from 'react'

interface Props {
  request: Request
  mainIframeUrl: string
  mapIframeUrl: string
}

/* Pure component */
export default function StatistiquesPages(props: Props) {
  return (
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
            src="${props.mainIframeUrl}"
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
            src="${props.mapIframeUrl}"
            frameBorder="0"
            width="100%"
            allowTransparency
            onload="iFrameResize({}, this)"
          ></iframe>`,
          }}
        ></div>
      </section>
    </main>
  )
}
