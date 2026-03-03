import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {},
  poweredByHeader: false,
  turbopack: {},
  serverExternalPackages: [
    '@potentiel-applications/api',
    '@potentiel-applications/api-documentation',
    '@potentiel-applications/bootstrap',
    '@potentiel-applications/document-builder',
    '@potentiel-applications/notifications',
    '@potentiel-applications/request-context',
    '@potentiel-applications/routes',
    '@potentiel-domain/appel-offre',
    '@potentiel-domain/entity',
    '@potentiel-domain/projet',
    '@potentiel-domain/reseau',
    '@potentiel-domain/statistiques-utilisation',
    '@potentiel-domain/utilisateur',
    '@potentiel-infrastructure/ds-api-client',
    '@potentiel-infrastructure/filigrane-facile-client',
    '@potentiel-infrastructure/geo-api-client',
    '@potentiel-libraries/csv',
    '@potentiel-libraries/iso8601-datetime',
    '@potentiel-libraries/monads',
    '@potentiel-libraries/monitoring',
    'mediateur',
    'pg-format',
  ],
  async redirects() {
    return [
      {
        source: '/projet/:guid/details.html',
        destination: '/legacy/:guid',
        permanent: true,
      },
      // Redirection pour les anciens chemins d'accès aux garanties financières
      // à supprimer ~octobre 2026
      {
        source: '/laureats/:identifiant/garanties-financieres/depot:soumettre',
        destination: '/laureats/:identifiant/garanties-financieres/depot/soumettre',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

// export default withSentryConfig(nextConfig, {
//   release: { create: false, name: '' },
//   // For all available options, see:
//   // https://github.com/getsentry/sentry-webpack-plugin#options

//   org: process.env.SENTRY_ORG,
//   project: process.env.SENTRY_PROJECT,
//   sentryUrl: process.env.SENTRY_URL,

//   // Only print logs for uploading source maps in CI
//   // silent: !process.env.CI,

//   // Upload a larger set of source maps for prettier stack traces (increases build time)
//   // widenClientFileUpload: true,

//   sourcemaps: {
//     deleteSourcemapsAfterUpload: true,
//   },
// });

export default nextConfig;
