import asyncHandler from '../helpers/asyncHandler';
import jwt from 'jsonwebtoken';
import { logger } from '../../core/utils';
import { AdemeStatistiquesPage } from '../../views';
import { v1Router } from '../v1Router';
import { ensureRole } from '../../config';
import { GET_ADEME_STATISTIQUES } from '@potentiel/legacy-routes';

const { METABASE_SECRET_KEY, METABASE_SITE_URL } = process.env;

if (!METABASE_SECRET_KEY || !METABASE_SITE_URL) {
  logger.error('Missing METABASE_SECRET_KEY and/or METABASE_SITE_URL environment variables');
}

v1Router.get(
  GET_ADEME_STATISTIQUES,
  ensureRole(['ademe']),
  asyncHandler(async (request, response) => {
    if (!METABASE_SECRET_KEY || !METABASE_SITE_URL) {
      response.status(500).send('Service indisponible');
    }

    const tokenForDashboard = jwt.sign(
      {
        resource: { dashboard: 5 },
        params: {},
        exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
      },
      METABASE_SECRET_KEY,
    );

    const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${tokenForDashboard}#bordered=false&titled=false`;

    response.send(
      AdemeStatistiquesPage({
        request,
        iframeUrl,
      }),
    );
  }),
);
