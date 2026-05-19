/** @type {import('next').NextConfig} */
const nextConfig = {
  // React 配置
  reactStrictMode: true,
  
  // 圖片優化
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 環境變數
  env: {
    NEXT_PUBLIC_APP_NAME: "OZY Studio Inspection System",
  },

  // 構建配置
  swcMinify: true,
  productionBrowserSourceMaps: false,

  // 實驗性功能
  experimental: {
    optimizePackageImports: ["@supabase/supabase-js"],
    isrMemoryCacheSize: 0,
  },
  
  // 禁用靜態預渲染
  staticPageGenerationTimeout: 0,

  // 重定向
  async redirects() {
    return [];
  },

  // 自訂 headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
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
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },

  // 路由配置
  pageExtensions: ["ts", "tsx", "js", "jsx"],

  // 編譯器配置
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 性能優化
  compress: true,
  poweredByHeader: false,

  // 生成配置
  generateEtags: true,
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig;
