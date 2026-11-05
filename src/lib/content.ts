/**
 * Single entry point for site content. Pages never import JSON directly —
 * they call these helpers, so the JSON layout can change in one place.
 */
import { z } from 'zod';

export const LANGS = ['zh', 'pl'] as const;
export type Lang = (typeof LANGS)[number];
export const otherLang = (lang: Lang): Lang => (lang === 'zh' ? 'pl' : 'zh');

const Meta = { title: z.string(), description: z.string() };
const Photo = { photo: z.string(), alt: z.string() };
const Group = z.object({ title: z.string(), items: z.array(z.string()) });
const Table = { columns: z.array(z.string()).length(3), rows: z.array(z.array(z.string()).length(3)), note: z.string() };

const Site = z.object({
  brand: z.object({ name: z.string(), short: z.string() }),
  contact: z.object({ email: z.string(), phone: z.string(), address: z.record(z.enum(LANGS), z.string()) }),
  languages: z.array(z.enum(LANGS)),
  defaultLanguage: z.enum(LANGS),
});

const Ui = z.object({
  nav: z.object({
    home: z.string(), about: z.string(), services: z.string(),
    approach: z.string(), projects: z.string(), contact: z.string(),
  }),
  langName: z.record(z.enum(LANGS), z.string()),
  menu: z.string(),
  cta: z.object({ contact: z.string(), more: z.string(), allServices: z.string(), next: z.string(), approach: z.string(), about: z.string(), projects: z.string(), team: z.string() }),
  status: z.object({ planned: z.string() }),
  roles: z.object({ base: z.string(), coverage: z.string() }),
  tags: z.object({
    about: z.string(), services: z.string(), markets: z.string(), approach: z.string(),
    values: z.string(), team: z.string(), experience: z.string(), projects: z.string(), contact: z.string(), service: z.string(), lifecycle: z.string(),
  }),
  nextStep: z.string(),
  relatedProjects: z.string(),
  footer: z.object({ tagline: z.string(), navTitle: z.string(), contactTitle: z.string() }),
});

const Market = z.object({ name: z.string(), local: z.string(), role: z.enum(['base', 'coverage']) });

const Home = z.object({
  ...Meta,
  hero: z.object({ headline: z.string(), sub: z.string(), ...Photo }),
  facts: z.array(z.object({ k: z.string(), v: z.string() })),
  statement: z.string(),
  lifecycle: z.object({
    headline: z.string(),
    steps: z.array(z.object({ title: z.string(), text: z.string(), service: z.string() })).length(5),
    footer: z.string(),
    footerService: z.string(),
  }),
  services: z.object({ headline: z.string() }),
  band: z.object({ text: z.string(), ...Photo }),
  markets: z.object({ headline: z.string(), items: z.array(Market), note: z.string() }),
  approach: z.object({ headline: z.string() }),
  values: z.object({ headline: z.string() }),
  closing: z.object({ headline: z.string(), sub: z.string() }),
});

const About = z.object({
  ...Meta, lede: z.string(), ...Photo,
  intro: z.object({ headline: z.string(), text: z.string() }),
  operating: z.object({ headline: z.string(), ...Table }),
  team: z.object({
    headline: z.string(),
    groups: z.array(z.object({ title: z.string(), text: z.string(), items: z.array(z.string()) })),
    footer: z.string(),
  }),
  band: z.object({ text: z.string(), ...Photo }),
});

const Approach = z.object({
  ...Meta, lede: z.string(), ...Photo,
  headline: z.string(),
  stages: z.array(Group).length(3),
  stagesNote: z.string(),
  valuesHeadline: z.string(),
  values: z.array(Group),
});

const Projects = z.object({ ...Meta, lede: z.string(), ...Photo, headline: z.string(), ...Table, rowServices: z.array(z.array(z.string())) })
  .refine((p) => p.rowServices.length === p.rows.length, { message: 'rowServices must be parallel to rows', path: ['rowServices'] });

const Contact = z.object({
  ...Meta, lede: z.string(), ...Photo,
  labels: z.object({ email: z.string(), phone: z.string(), address: z.string() }),
});

const ServicesPage = z.object({ ...Meta, lede: z.string(), ...Photo, headline: z.string(), order: z.array(z.string()).length(6) });

const Service = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  short: z.string(),
  subtitle: z.string(),
  status: z.enum(['current', 'planned']),
  ...Photo,
  groups: z.array(Group).min(1),
  note: z.string(),
});
export type Service = z.infer<typeof Service>;
export type Market = z.infer<typeof Market>;

// eager glob so everything is validated at build time
const files = import.meta.glob('../content/**/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;

function load<T>(path: string, schema: z.ZodType<T>): T {
  const raw = files[`../content/${path}`];
  if (raw === undefined) throw new Error(`content file missing: src/content/${path}`);
  const r = schema.safeParse(raw);
  if (!r.success) throw new Error(`content invalid: src/content/${path}\n${r.error.message}`);
  return r.data;
}

export const site = load('site.json', Site);
export const getUi = (lang: Lang) => load(`${lang}/ui.json`, Ui);
export const getHome = (lang: Lang) => load(`${lang}/home.json`, Home);
export const getAbout = (lang: Lang) => load(`${lang}/about.json`, About);
export const getApproach = (lang: Lang) => load(`${lang}/approach.json`, Approach);
export const getProjects = (lang: Lang) => load(`${lang}/projects.json`, Projects);
export const getContact = (lang: Lang) => load(`${lang}/contact.json`, Contact);
export const getService = (lang: Lang, id: string) => load(`${lang}/services/${id}.json`, Service);

/** all six business lines, in the order set by services.json */
export const getServicesPage = (lang: Lang) => load(`${lang}/services.json`, ServicesPage);
export const listServices = (lang: Lang): Service[] => getServicesPage(lang).order.map((id) => getService(lang, id));
