import type { PageLoad } from './$types';
import { fetchPaginated } from '$lib/utils/api';

export const load: PageLoad = async ({ depends, url, parent }) => {
  depends('app:requests');
  const { config } = await parent();
  const { data, meta } = await fetchPaginated(config, 'requests');

  return {
    requests: data,
    meta,
    path: url.pathname
  };
};