import type { PageLoad } from './$types';
import { fetchPaginated } from '$lib/utils/api';

export const load: PageLoad = async ({ depends, url, parent }) => {
  depends('app:queries');
  const { config } = await parent();
  const { data, meta } = await fetchPaginated(config, 'queries');

  return {
    queries: data,
    meta,
    path: url.pathname
  };
};