import { categoryLabels, previewKinds } from '../data/portfolio';
import { serviceIcons } from '../data/services';
import { defaultContent, type ContentCollection } from '../content/schema';

/**
 * Editor definitions for content managed in the dashboard. Field keys must match the content
 * types in src/data and the converters in src/content/schema.ts.
 */
export type FieldKind = 'text' | 'textarea' | 'lines' | 'tags' | 'select' | 'checkbox' | 'image' | 'gallery';

export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
}

export interface ContentConfig {
  collection: ContentCollection;
  title: string;
  singular: string;
  /** Path on the public site where this content appears. */
  publicPath: string;
  fields: FieldDef[];
  /** Field shown as the list label. */
  labelKey: string;
  sublabel: (item: Record<string, unknown>) => string;
}

const labelFor = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const projectsConfig: ContentConfig = {
  collection: 'projects',
  title: 'Portfolio',
  singular: 'project',
  publicPath: '/portfolio/',
  labelKey: 'title',
  sublabel: (p) => categoryLabels[p.category as keyof typeof categoryLabels] ?? '',
  fields: [
    { key: 'title', label: 'Title', kind: 'text', required: true },
    {
      key: 'category',
      label: 'Category',
      kind: 'select',
      required: true,
      options: Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
    },
    { key: 'industry', label: 'Industry / type', kind: 'text', help: 'e.g. E-commerce · Sports equipment (UAE)' },
    { key: 'summary', label: 'Summary', kind: 'textarea', required: true, help: 'One or two sentences, shown on the card.' },
    { key: 'details', label: 'Details', kind: 'textarea', help: 'Shown when the project is opened.' },
    { key: 'features', label: 'Key features', kind: 'lines', help: 'One per line.' },
    { key: 'tech', label: 'Technologies', kind: 'tags', help: 'Comma-separated, e.g. React, Node.js, Firebase' },
    { key: 'url', label: 'Live website URL', kind: 'text', help: 'Shown as “Visit website”. Include https://' },
    { key: 'images', label: 'Screenshots', kind: 'gallery', help: 'The first image is the card cover. Desktop shots at 16:10 look best; mobile shots are shown whole.' },
    {
      key: 'preview',
      label: 'Illustration (when there is no screenshot)',
      kind: 'select',
      options: previewKinds.map((value) => ({ value, label: labelFor(value) })),
    },
    { key: 'isDemo', label: 'Concept project (shows a “Concept” badge; not client work)', kind: 'checkbox' },
  ],
};

export const servicesConfig: ContentConfig = {
  collection: 'services',
  title: 'Services',
  singular: 'service',
  publicPath: '/services/',
  labelKey: 'title',
  sublabel: (s) => String(s.short ?? ''),
  fields: [
    { key: 'title', label: 'Title', kind: 'text', required: true },
    { key: 'icon', label: 'Icon', kind: 'select', options: Object.keys(serviceIcons).map((value) => ({ value, label: labelFor(value) })) },
    { key: 'short', label: 'Short description', kind: 'textarea', required: true, help: 'Shown on service cards.' },
    { key: 'description', label: 'Full description', kind: 'textarea', required: true },
    { key: 'deliverables', label: 'Typical deliverables', kind: 'lines', help: 'One per line.' },
  ],
};

export const positionsConfig: ContentConfig = {
  collection: 'positions',
  title: 'Open positions',
  singular: 'position',
  publicPath: '/careers/',
  labelKey: 'title',
  sublabel: (p) => [p.type, p.location].filter(Boolean).join(' · '),
  fields: [
    { key: 'title', label: 'Job title', kind: 'text', required: true },
    { key: 'type', label: 'Employment type', kind: 'text', required: true, help: 'e.g. Full-time, Part-time, Contract, Internship' },
    { key: 'location', label: 'Location', kind: 'text', required: true, help: 'e.g. Remote, On-site, Hybrid' },
    { key: 'summary', label: 'Summary', kind: 'textarea', required: true, help: 'Shown on the job card.' },
    { key: 'description', label: 'Full description', kind: 'textarea', help: 'Responsibilities and requirements, shown on the application page.' },
  ],
};

/** Built-in items for a collection, as imported into Firestore. */
export const builtInItems = (collection: ContentCollection) =>
  defaultContent[collection] as unknown as ({ id: string } & Record<string, unknown>)[];
