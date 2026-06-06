// Allow indexing for all user agents
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: undefined,
  };
}


