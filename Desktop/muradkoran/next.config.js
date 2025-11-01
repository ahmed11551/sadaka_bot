/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_WEB_APP_URL: process.env.TELEGRAM_WEB_APP_URL,
  },
}

module.exports = nextConfig

