import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** URL externa obrigatoriamente HTTPS. Links opcionais devem ser OMITIDOS, nunca "" ou "#". */
const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.domain });

const projetos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
  schema: ({ image }) =>
    z
      .object({
        titulo: z.string().min(3).max(80),
        resumo: z.string().min(20).max(240),
        capa: image(),
        capaAlt: z.string().min(10).max(160),
        tecnologias: z.array(z.string().min(1)).min(1),
        papel: z.string().min(3).max(120),
        contexto: z.string().min(3).max(120),
        ano: z.number().int().min(2000).max(2100),
        destaque: z.boolean().default(false),
        /** Ordem de exibição entre destaques (menor primeiro). */
        ordem: z.number().int().min(0).default(100),
        links: z
          .object({
            github: httpsUrl.optional(),
            demo: httpsUrl.optional(),
          })
          .strict()
          .default({}),
        galeria: z
          .array(
            z
              .object({
                imagem: image(),
                alt: z.string().min(10).max(200),
                legenda: z.string().max(200).optional(),
              })
              .strict(),
          )
          .default([]),
      })
      .strict(),
});

export const collections = { projetos };
