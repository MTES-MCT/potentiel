/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { webpackBuildWorker: true, typedRoutes: true },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: 'asset/resource',
    });

    if (isServer) {
      config.externals.push(/^@potentiel-/, 'mediateur');
    }

    return config;
  },
};

module.exports = nextConfig;
