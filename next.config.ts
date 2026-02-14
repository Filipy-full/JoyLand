import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.supabase.co',
          pathname: '/storage/v1/object/public/galeria/**',
        },
        {
          protocol: 'https',
          hostname: '**.supabase.co',
          pathname: '/storage/v1/object/public/**',
        },
        {
          protocol: 'https',
          hostname: 'media.floresfrescasonline.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'hzajwfifjqdmryycufsp.supabase.co',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'joylandweb.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'supabase.co',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'cdn.joylandweb.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'static.joylandweb.com',
          pathname: '/**',
        },
      ],
    },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://vercel.live https://va.vercel-scripts.com; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https:; " +
              "font-src 'self'; " +
              "connect-src 'self' https: wss:; " +
              "frame-ancestors 'self'; " +
              "frame-src https://www.google.com https://www.google.com/maps/embed?; " +
              "child-src https://www.google.com https://www.google.com/maps/embed?;",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
