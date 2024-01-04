import asyncHandler from '../helpers/asyncHandler';
import jwt from 'jsonwebtoken';
import { logger } from '../../core/utils';
import { StatistiquesPage } from '../../views';
import { v1Router } from '../v1Router';

import { PAGE_STATISTIQUES } from '@potentiel/legacy-routes';

const { METABASE_SECRET_KEY, METABASE_SITE_URL } = process.env;

if (!METABASE_SECRET_KEY || !METABASE_SITE_URL) {
  logger.error('Missing METABASE_SECRET_KEY and/or METABASE_SITE_URL environment variables');
}

v1Router.get(
  PAGE_STATISTIQUES,
  asyncHandler(async (request, response) => {
    if (!METABASE_SECRET_KEY || !METABASE_SITE_URL) {
      response.status(500).send('Service indisponible');
    }

    const tokenForMainDashboard = jwt.sign(
      {
        resource: { dashboard: 2 },
        params: {},
        exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
      },
      METABASE_SECRET_KEY,
    );

    const mainIframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${tokenForMainDashboard}#bordered=false&titled=false`;

    const tokenForMapDashboard = jwt.sign(
      {
        resource: { dashboard: 3 },
        params: {},
        exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
      },
      METABASE_SECRET_KEY,
    );

    const mapIframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${tokenForMapDashboard}#bordered=false&titled=false`;

    response.send(
      StatistiquesPage({
        request,
        mainIframeUrl,
        mapIframeUrl,
      }),
    );
  }),
);
