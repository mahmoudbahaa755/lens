import type { LensConfig } from '$lib/stores/config';

export async function fetchPaginated(
  config: LensConfig,
  resource: 'requests' | 'queries',
  page = 1,
  perPage = 100
) {
  if (!config) {
    throw new Error('Lens config not loaded');
  }

  const url = `${config.api[resource]}?page=${page}&perPage=${perPage}`;
  const response = await fetch(url);
  return await response.json();
}