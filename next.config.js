/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lunar-javascript'],
};

// Bản web tĩnh (npm run build:static): xuất HTML/JS vào out/, không cần máy chủ Node.
if (process.env.STATIC_EXPORT === '1') {
  const basePath = process.env.TUVI_BASE_PATH || undefined;
  Object.assign(nextConfig, {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
    basePath,
    env: { NEXT_PUBLIC_STATIC: '1', NEXT_PUBLIC_BASE_PATH: basePath ?? '' },
  });
}

module.exports = nextConfig;
