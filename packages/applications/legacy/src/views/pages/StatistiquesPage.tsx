import type { Request } from 'express';
import React from 'react';
import { Heading1, LegacyPageTemplate } from '../components';
import { hydrateOnClient } from '../helpers';

type StatistiquesProps = {
  request: Request;
  mainIframeUrl: string;
  mapIframeUrl: string;
};

export const Statistiques = ({ mapIframeUrl, mainIframeUrl, request }: StatistiquesProps) => {
  return (
    <LegacyPageTemplate user={request.user}>
      <section className="py-20 bg-blue-france-sun-base">
        <div className="text-center">
          <Heading1 className="!text-white">Potentiel en chiffres</Heading1>
          <p className="text-white">Au service des porteurs de projets</p>
        </div>
      </section>
      <section>
        <script src="https://metabase.potentiel.beta.gouv.fr/app/iframeResizer.js"></script>
        <div
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
    </LegacyPageTemplate>
  );
};

hydrateOnClient(Statistiques);
