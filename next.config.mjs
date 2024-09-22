/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains:  [new URL(process.env.NEXT_PUBLIC_API_URL).hostname],
  },
  reactStrictMode: false,
};

export default nextConfig;
