// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * URL pública usada em canonical, Open Graph e sitemap.
 * - Padrão: endereço Vercel atualmente publicado e verificado (HTTP 200 em 13/11/2026).
 * - Quando houver domínio próprio, defina SITE_URL no ambiente da Vercel (ver README/PENDENCIAS).
 */
const SITE_URL = process.env.SITE_URL ?? 'https://harada-dev-systems.vercel.app';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: {
    format: 'file',
    // CSS sempre em arquivo externo: permite CSP estrita (style-src 'self') sem hashes.
    inlineStylesheets: 'never',
  },
  env: {
    schema: {
      // Definida automaticamente pela Vercel. 'preview' => noindex + robots bloqueando rastreio.
      VERCEL_ENV: envField.enum({
        context: 'server',
        access: 'public',
        values: ['production', 'preview', 'development'],
        optional: true,
      }),
      // Ative SOMENTE depois de habilitar Web Analytics / Speed Insights no painel da Vercel
      // (sem isso os scripts /_vercel/* retornam 404 e geram erro no console).
      ANALYTICS_ENABLED: envField.boolean({ context: 'server', access: 'public', default: false }),
      // Eventos personalizados (cliques em CTA/WhatsApp) exigem plano Vercel com Custom Events.
      ANALYTICS_EVENTS_ENABLED: envField.boolean({
        context: 'server',
        access: 'public',
        default: false,
      }),
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  image: {
    // Imagens otimizadas em build pelo serviço sharp (WebP por padrão no <Image />).
    responsiveStyles: false,
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Nenhum asset/script embutido em linha: mantém a CSP do vercel.json sem 'unsafe-inline'.
      assetsInlineLimit: 0,
    },
  },
});
