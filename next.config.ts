/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed API proxy to fix cookie issues
  devIndicators: false
  // The frontend will make direct calls to the backend
}

module.exports = nextConfig
