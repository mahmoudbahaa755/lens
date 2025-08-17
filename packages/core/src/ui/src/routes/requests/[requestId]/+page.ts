import type { PageLoad } from './$types';
export const prerender = false;

export const load: PageLoad = async ({ fetch, params, depends, url, parent }) => {
  depends('app:request');
  const { config } = await parent();
  if (!config) {
    // This should not happen as the layout load will run first
    throw new Error('Lens config not loaded');
  }
  const response = await fetch(`${config.api.requests}/${params.requestId}`);
  const { data } = await response.json();

  return {
    request: data,
    queries: data.queries,
    user: data.user,
    path: url.pathname
  };
};
