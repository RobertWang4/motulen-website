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
const Table = { columns: z.array(z.string()).length(3), rows: z.array(z.array(z.string()).length(3)), note: z.string().optional() };

const Site = z.object({
  brand: z.object({ name: z.string(), short: z.string() }),
  contact: z.object({ email: z.string(), phone: z.string(), address: z.record(z.enum(LANGS), z.string()) }),
  languages: z.array(z.enum(LANGS)),
  defaultLanguage: z.enum(LANGS),
});

const Ui = z.object({
  nav: z.object({
    home: z.string(), about: z.string(), company: z.string(), value: z.string(), projects: z.string(),
    services: z.string(), platform: z.string(), contact: z.string(),
  }),
  /** one-line descriptions under the three "About" menu entries */
  navDesc: z.object({ company: z.string(), value: z.string(), projects: z.string() }),
  langName: z.record(z.enum(LANGS), z.string()),
  menu: z.string(),
  cta: z.object({ contact: z.string(), allCases: z.string(), more: z.string() }),
  status: z.object({ planned: z.string() }),
  roles: z.object({ base: z.string(), coverage: z.string() }),
  tags: z.object({
    about: z.string(), services: z.string(), scope: z.string(), markets: z.string(), value: z.string(), management: z.string(),
    experience: z.string(), projects: z.string(), platform: z.string(), team: z.string(), talent: z.string(),
    contact: z.string(), service: z.string(),
  }),
  nextStep: z.string(),
  relatedProjects: z.string(),
  footer: z.object({ tagline: z.string(), navTitle: z.string(), contactTitle: z.string() }),
});

const Market = z.object({ name: z.string(), local: z.string(), role: z.enum(['base', 'coverage']) });

const GROUPS = ['people', 'engineering'] as const;
export type ServiceGroup = (typeof GROUPS)[number];

const Home = z.object({
  ...Meta,
  hero: z.object({
    /** two lines */
    headline: z.array(z.string()).length(2),
    sub: z.string(), small: z.string(), cta: z.string(),
    video: z.string(), poster: z.string(), alt: z.string(),
  }),
  services: z.object({ headline: z.string() }),
  projects: z.object({ headline: z.string() }),
  value: z.object({ headline: z.string() }),
  platform: z.object({ headline: z.string() }),
  closing: z.object({ headline: z.string(), sub: z.string(), ...Photo }),
});

const About = z.object({
  ...Meta, ...Photo,
  headline: z.array(z.string()).length(2),
  text: z.array(z.string()),
  scope: z.object({ title: z.string(), items: z.array(z.string()) }),
  layout: z.object({
    title: z.string(), headline: z.string(),
    /** item 06 of the business layout; items 01-05 come from the service files */
    extra: z.object({ number: z.string(), title: z.string(), short: z.string(), plan: z.boolean(), ...Photo }),
  }),
});

const Value = z.object({
  ...Meta, lede: z.string(),
  values: z.object({ headline: z.string(), items: z.array(Group).length(5) }),
  management: z.object({ headline: z.string(), lede: z.string(), stages: z.array(Group).length(3), note: z.string() }),
});

const Case = z.object({
  id: z.string(), number: z.string(), title: z.string(), paragraphs: z.array(z.string()).min(1), services: z.array(z.string()),
});
const Projects = z.object({
  ...Meta, headline: z.string(), intro: z.string(), cases: z.array(Case).length(5), note: z.string(),
});

const Platform = z.object({
  ...Meta, lede: z.string(),
  markets: z.object({ headline: z.string(), sub: z.string(), items: z.array(Market), note: z.string() }),
  operating: z.object({ headline: z.string(), ...Table }),
  team: z.object({ headline: z.string(), lede: z.string(), groups: z.array(Group), ...Photo, caption: z.string() }),
  talent: z.object({ headline: z.string(), items: z.array(z.string()), linkLabel: z.string() }),
});

const Contact = z.object({
  ...Meta, lede: z.string(), ...Photo,
  labels: z.object({ email: z.string(), phone: z.string(), address: z.string() }),
});

/** service order and the two group names shown in menus and on the home page */
const ServicesIndex = z.object({
  order: z.array(z.string()).length(5),
  groups: z.object({ people: z.string(), engineering: z.string() }),
});

const Service = z.object({
  id: z.string(),
  number: z.string(),
  group: z.enum(GROUPS),
  title: z.string(),
  short: z.string(),
  subtitle: z.string(),
  photos: z.array(z.object({ src: z.string(), alt: z.string() })).min(1),
  caption: z.string().optional(),
  groups: z.array(Group).min(1),
  note: z.string(),
  /** development plan, not an existing capability (shown with a "planned" chip) */
  plan: z.boolean().optional(),
  link: z.object({ label: z.string(), href: z.string() }).optional(),
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
export const getValue = (lang: Lang) => load(`${lang}/value.json`, Value);
export const getProjects = (lang: Lang) => load(`${lang}/projects.json`, Projects);
export const getPlatform = (lang: Lang) => load(`${lang}/platform.json`, Platform);
export const getContact = (lang: Lang) => load(`${lang}/contact.json`, Contact);
export const getService = (lang: Lang, id: string) => load(`${lang}/services/${id}.json`, Service);

const getServicesIndex = (lang: Lang) => load(`${lang}/services.json`, ServicesIndex);
/** the five services, in the order set by services.json */
export const listServices = (lang: Lang): Service[] => getServicesIndex(lang).order.map((id) => getService(lang, id));
/** the services split into the two menu groups (group title + its services, in service order) */
export const groupedServices = (lang: Lang) => {
  const names = getServicesIndex(lang).groups;
  const all = listServices(lang);
  return GROUPS.map((key) => ({ key, title: names[key], items: all.filter((s) => s.group === key) }));
};

/** data for the main menu and the footer */
export const getNav = (lang: Lang) => {
  const ui = getUi(lang);
  const about = (['company', 'value', 'projects'] as const).map((id) => ({
    id, label: ui.nav[id], desc: ui.navDesc[id], href: `/${lang}/${id === 'company' ? 'about' : id}/`,
  }));
  const groups = groupedServices(lang).map((g) => ({
    key: g.key, title: g.title,
    items: g.items.map((s) => ({ id: s.id, number: s.number, title: s.title, short: s.short, plan: !!s.plan, href: `/${lang}/services/${s.id}/` })),
  }));
  return { ui, about, groups };
};
