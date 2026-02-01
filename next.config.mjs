/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**", // дозволяємо всі шляхи
      },
    ],
  },
};

export default nextConfig;
