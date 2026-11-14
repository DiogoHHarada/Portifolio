import type { APIRoute } from 'astro';
import { VERCEL_ENV } from 'astro:env/server';

/** robots.txt coerente com o domínio configurado em `site` (RF-14, RNF-12, RNF-14). */
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Defina `site` em astro.config.mjs.');

  const corpo =
    VERCEL_ENV === 'preview'
      ? ['User-agent: *', 'Disallow: /', ''].join('\n')
      : [
          'User-agent: *',
          'Allow: /',
          '',
          `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
          '',
        ].join('\n');

  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
