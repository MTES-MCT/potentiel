import type { Request } from 'express';
import React from 'react';
import { Heading1, LegacyPageTemplate } from '@components';
import { hydrateOnClient } from '../helpers';

type StatistiquesProps = {
  request: Request;
  mainIframeUrl: string;
  mapIframeUrl: string;
};

export const Statistiques = ({ mapIframeUrl, mainIframeUrl, request }: StatistiquesProps) => {
  return (
    <LegacyPageTemplate user={request.user}>
      <main role="main">
        <section className="section section-color">
          <div className="container">
            <Heading1 className="section__title">Potentiel en chiffres</Heading1>
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
    </LegacyPageTemplate>
  );
};

hydrateOnClient(Statistiques);
