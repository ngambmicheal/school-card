/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
   typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
}
