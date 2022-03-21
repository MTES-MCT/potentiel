import type { Request } from 'express'
import React from 'react'
import { PageLayout } from '../../components/PageLayout'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'

interface Props {
  request: Request
  iframeUrl: string
}

/* Pure component */
export const AdminStatistiques = PageLayout(function (props: Props) {
  return (
    <main role="main">
      <section className="section section-color">
        <div className="container">
          <h2 className="section__title">Admin statistiques</h2>
        </div>
      </section>
      <section className="section section-white" style={{ paddingTop: 0 }}>
        <script src="https://metabase.potentiel.beta.gouv.fr/app/iframeResizer.js"></script>
        <div
          className="container"
          dangerouslySetInnerHTML={{
            __html: `<iframe
            src="${props.iframeUrl}"
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
})

hydrateOnClient(AdminStatistiques)
