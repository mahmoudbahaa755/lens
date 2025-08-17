import type { LayoutLoad } from './$types';
import type { LensConfig } from '$lib/stores/config';

export const prerender = true;
export const ssr = false;
export const load: LayoutLoad = async ({ fetch, url }) => {
  const response = await fetch('/lens-config');
  const config: LensConfig = await response.json();

  return {
    config,
    path: url.pathname
  };
};