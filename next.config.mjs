import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV === 'development';

// Build CSP as an array then join so it's easy to read and diff.
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' required for Next.js inline scripts + JSON-LD script tags.
  // 'unsafe-eval' required in dev only — Next.js react-refresh HMR runtime uses Function().
  // 'wasm-unsafe-eval' required for KTX2/Basis + MeshoptDecoder WASM (Three.js / GLB loading).
  // blob: required for KTX2Loader — it creates a Worker from a blob: URL, and browsers
  // that don't fully honour worker-src independently fall back to checking script-src.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} 'wasm-unsafe-eval' blob: https://cdn.cal.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://retrotekt.vercel.app https://retrotekt.com https://www.retrotekt.com",
  "font-src 'self'",
  // blob: required — Three.js ImageLoader uses fetch() to load blob-URL textures (WebP/GLB).
  "connect-src 'self' blob:",
  "frame-src https://cal.com https://calendly.com",
  // blob: needed for Three.js / Draco worker blobs.
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  // Prevent this page from being framed by external sites (clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features not needed on a marketing site.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // 2-year HSTS with preload — only enable once HTTPS is confirmed stable.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      // Immutable assets — 1-year cache, no revalidation needed.
      {
        source: '/models/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Content-Encoding', value: 'identity' },
        ],
      },
      {
        source: '/basis/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Portfolio & showcase images are content-addressed (build script writes
      // fixed filenames) — treat them as immutable for repeat-visitor caching.
      {
        source: '/portfolio/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/showcase/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Home route: preload the Basis (KTX2) transcoder WASM so it is warmed
      // before the GLB triggers texture transcoding. The GLB itself is loaded
      // after the initial text paint so it does not compete with LCP.
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: [
              '</basis/basis_transcoder.wasm>; rel=preload; as=fetch; crossorigin=anonymous',
              '</basis/basis_transcoder.js>; rel=preload; as=script; crossorigin=anonymous',
            ].join(', '),
          },
        ],
      },
      // Sitemap and robots — cache for 1 day; they change rarely.
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
        ],
      },
      // All pages: security headers + no-cache for HTML.
      {
        source: '/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          ...SECURITY_HEADERS,
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/pricing', destination: '/consulting', permanent: true },
      { source: '/about', destination: '/consulting', permanent: true },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [],
  },

  experimental: {
    optimizePackageImports: [
      'three',
      'three/examples/jsm/loaders/GLTFLoader',
      'three/examples/jsm/loaders/KTX2Loader',
      'three/examples/jsm/libs/meshopt_decoder.module',
      'three/examples/jsm/environments/RoomEnvironment',
      'gsap',
    ],
    optimizeCss: true,
    scrollRestoration: true,
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
