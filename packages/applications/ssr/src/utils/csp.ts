import { randomBytes } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

export const setCspHeader = (request: IncomingMessage, response: ServerResponse) => {
  const isDev = process.env.NODE_ENV !== 'production';

  const nonce = randomBytes(16).toString('base64');

  const cspHeaderValues = {
    'default-src': ["'self'", 'blob:', 'https://metabase.potentiel.beta.gouv.fr'],
    'connect-src': [
      "'self'",
      'https://potentiel.beta.gouv.fr',
      'https://*.crisp.chat',
      'wss://client.relay.crisp.chat',
      'wss://*.relay.crisp.chat',
      'wss://*.relay.rescue.crisp.chat',
      'https://sentry.incubateur.net',

      process.env.NEXT_PUBLIC_GEO_API_URL ?? '',
    ],
    'media-src  ': ["'self'", 'https://*.crisp.chat'],
    'font-src': ["'self'", 'https://*.crisp.chat'],
    'frame-src': ['https://metabase.potentiel.beta.gouv.fr', 'https://*.crisp.chat', 'blob:'],
    'img-src': ["'self'", 'data:', 'https://*.crisp.chat'],
    'style-src': ["'self'", "'unsafe-inline'", 'data:', 'https://*.crisp.chat'],
    'script-src': [
      "'self'",
      // every inline <script> must have this nonce, or will be forbidden to run
      // also used by Next.js to inject its own scripts
      `'nonce-${nonce}'`,
      // whitelist the react-dsfr script. This may change in future versions of react-dsfr.
      // an alternative solution can be found here: https://react-dsfr.codegouv.studio/content-security-policy
      "'sha256-UEZfoO3SfsYbnIIAoHHUiIGOhT+nhTDv2gd4I5588HQ='",
      'https://metabase.potentiel.beta.gouv.fr',
      'https://*.crisp.chat',
      // whitelist scalar
      "'sha256-RG6G8sfmsknwGzYCV+Cc56LE1j6++Gv3RE1sevFccm8='",
      'https://cdn.jsdelivr.net/npm/@scalar/api-reference',
      // https://nextjs.org/docs/app/guides/content-security-policy#development-environment
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
  };

  const cspHeader = Object.entries(cspHeaderValues)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');

  // Case matters - Next.js will parse the header to find the nonce and inject it into its own scripts
  const headerName = isDev ? 'content-security-policy-report-only' : 'content-security-policy';

  request.headers[headerName] = cspHeader;
  response.setHeader(headerName, cspHeader);
};
