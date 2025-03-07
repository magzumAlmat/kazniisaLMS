/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();
const nextConfig = {
    webpack(config) {
        config.infrastructureLogging = { debug: /PackFileCache/ }
        return config;
      }
}

module.exports = withNextIntl(
    
);
