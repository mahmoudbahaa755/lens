import type { PageLoad } from './$types';
export const prerender = false;

export const load: PageLoad = async ({ fetch, params, depends, url, parent }) => {
  depends('app:query');
  const { config } = await parent();
  if (!config) {
    throw new Error('Lens config not loaded');
  }
  const response = await fetch(`${config.api.queries}/${params.queryId}`);
  const { data } = await response.json();

  return {
    query: data,
    path: url.pathname
  };
};
