import { writable } from 'svelte/store';

export type LensConfig = {
  appName: string;
  path: string;
  api: {
    requests: string;
    queries: string;
  };
};

export const lensConfig = writable<LensConfig | null>(null);
