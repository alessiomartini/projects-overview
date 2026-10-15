import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { STATUSES } from './lib/projects';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './data/projects' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(STATUSES),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    repo: z
      .string()
      .regex(/^[\w.-]+\/[\w.-]+$/, 'usa il formato "proprietario/nome-repo"')
      .optional(),
    link: z.url().optional(),
    started: z.coerce.date().optional(),
    finished: z.coerce.date().optional(),
    showDetails: z.boolean().default(false),
  }),
});

const inbox = defineCollection({
  loader: glob({ pattern: '*.md', base: './data/inbox' }),
  schema: z.object({
    date: z.coerce.date(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './data/notes' }),
  schema: z.object({
    project: z.string(),
    date: z.coerce.date(),
    type: z.enum(['nota', 'modifica', 'idea']).default('nota'),
    resolved: z.boolean().default(false),
  }),
});

export const collections = { projects, inbox, notes };
