<script lang="ts">
	import Table from '$lib/components/table.svelte';
	import { fetchPaginated } from '$lib/utils/api';
	import { CircleArrowRightIcon, PlusIcon } from '@lucide/svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	type Query = {
		id: string;
		data: {
			query: string;
			duration: string;
			createdAt: string;
		};
	};

	let { data: initialData } = $props();
	let queries = $state<Query[]>(initialData.queries);
	let meta = $state(initialData.meta);
	let loading = $state(false);

	async function loadMore() {
		if (loading || meta.currentPage >= meta.lastPage) {
			return;
		}

		loading = true;
		const nextPage = meta.currentPage + 1;
		const { data: newQueries, meta: newMeta } = await fetchPaginated(
			initialData.config,
			'queries',
			nextPage
		);

		queries = [...queries, ...newQueries];
		meta = newMeta;
		loading = false;
	}
</script>

{#snippet actionsSnippet(query: Query)}
	<a href="./queries/{query.id}" class="transition-colors duration-100 hover:text-white">
		<CircleArrowRightIcon size={20} />
	</a>
{/snippet}

<main class="w-full">
	<Table
		columns={[
			{
				name: 'Query',
				value: (query: Query) => query.data.query
			},
			{
				name: 'Duration',
				value: (query: Query) => query.data.duration,
				position: 'end'
			},
			{
				name: 'Happend',
				value: (query: Query) => dayjs(query.data.createdAt).fromNow(),
				position: 'end',
				class: 'min-w-32'
			},
			{
				name: 'Actions',
				render: actionsSnippet,
				position: 'end'
			}
		]}
		data={queries}
	/>

	{#if !queries.length}
		<p class="py-10 text-center text-neutral-400">No queries found</p>
	{/if}

	{#if meta.currentPage < meta.lastPage}
		<button
			onclick={loadMore}
			disabled={loading}
			class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 p-3 font-medium transition-colors duration-100 hover:bg-neutral-900 hover:underline active:bg-neutral-950"
		>
			<PlusIcon size={20} />
			{loading ? 'Loading...' : 'Load more'}
		</button>
	{/if}
</main>
