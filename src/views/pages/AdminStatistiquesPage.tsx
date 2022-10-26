import type { Request } from 'express'
import React from 'react'
import { PageTemplate } from '@components'
import { hydrateOnClient } from '../helpers'

type AdminStatistiquesProps = {
  request: Request
  iframeUrl: string
}

export const AdminStatistiques = ({ iframeUrl, request }: AdminStatistiquesProps) => {
  return (
    <PageTemplate user={request.user} currentPage="admin-statistiques">
      <main role="main" className="panel">
        <div className="panel__header">
          <h3>Tableau de bord</h3>
        </div>
        <section className="section section-white" style={{ paddingTop: 0 }}>
          <script src="https://metabase.potentiel.beta.gouv.fr/app/iframeResizer.js"></script>
          <div
            className="container"
            dangerouslySetInnerHTML={{
              __html: `<iframe
            src="${iframeUrl}"
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

hydrateOnClient(AdminStatistiques)
