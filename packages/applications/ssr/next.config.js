const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { webpackBuildWorker: true },
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: '/projet/:guid/details.html',
        destination: '/legacy/:guid',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: 'asset/resource',
    });

    if (isServer) {
      config.externals.push(/^@potentiel-/, 'mediateur');
    } else {
      // This resolves an issue with sentry in the logger.
      // Without this, the logger cannot be used in domain packages for instance
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...(config.resolve || {}).fallback,
          async_hooks: false,
          inspector: false,
          child_process: false,
          net: false,
          tls: false,
          fs: false,
        },
      };
    }
    return config;
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
        ],
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  release: { create: false, name: '' },
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  sentryUrl: process.env.SENTRY_URL,

  // Only print logs for uploading source maps in CI
  // silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: process.env.NEXT_PUBLIC_APPLICATION_STAGE !== 'local',
});
