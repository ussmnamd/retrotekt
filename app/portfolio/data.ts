import type { AssetKey } from './assets';

export type ProjectSlug =
  | 'chocolate-fish-modesto'
  | 'chocolate-fish-livermore'
  | 'chocolate-fish-sacramento';

export interface Project {
  slug: ProjectSlug;
  assetKey: AssetKey;
  name: string;
  client: string;
  city: string;
  year: string;
  type: string;
  tags: string[];
  scope: string[];
  description: string;
  pullQuote?: string;
  filterCategory: 'Renders' | 'Walkthroughs' | 'Construction Story';
  isFlagship: boolean;
}

export const projects: Project[] = [
  {
    slug: 'chocolate-fish-modesto',
    assetKey: 'modesto',
    name: 'Chocolate Fish — Modesto',
    client: 'Chocolate Fish Coffee Roasters',
    city: 'Modesto, CA',
    year: '2025',
    type: 'Full Project',
    tags: ['Hospitality', 'Cafe'],
    scope: [
      'Pre-construction renders',
      'Walkthrough animations',
      'Construction documentation',
      'Marketing assets',
    ],
    description:
      "Chocolate Fish's Modesto location was visualized end-to-end before a single fixture was ordered. We delivered photoreal renders, a walkthrough film, and tracked the build from foundation to opening day. The renders set the spec — the photographs prove they were hit.",
    pullQuote: 'From dirt to doors-open, every fixture pre-visualized.',
    filterCategory: 'Walkthroughs',
    isFlagship: true,
  },
  {
    slug: 'chocolate-fish-livermore',
    assetKey: 'livermore',
    name: 'Chocolate Fish — Livermore',
    client: 'Chocolate Fish Coffee Roasters',
    city: 'Livermore, CA',
    year: '2025',
    type: 'Renders + Construction',
    tags: ['Hospitality', 'Cafe'],
    scope: ['Pre-construction renders', 'Construction documentation'],
    description:
      "For their second California location, Chocolate Fish returned with the same brief: build it from a render. We specified the space in photoreal detail before ground broke, then documented the build as it rose. The finished café matches the renders shot for shot.",
    filterCategory: 'Renders',
    isFlagship: false,
  },
  {
    slug: 'chocolate-fish-sacramento',
    assetKey: 'sacramento',
    name: 'Chocolate Fish — Sacramento',
    client: 'Chocolate Fish Coffee Roasters',
    city: 'Sacramento, CA',
    year: '2025',
    type: 'Renders + Construction',
    tags: ['Hospitality', 'Cafe'],
    scope: ['Pre-construction renders', 'Construction documentation'],
    description:
      "Third location, same trusted process. Five photoreal renders locked the Sacramento design before construction began. Ten construction photographs document every stage — confirming the renders weren't aspirational, they were a specification.",
    filterCategory: 'Renders',
    isFlagship: false,
  },
];
