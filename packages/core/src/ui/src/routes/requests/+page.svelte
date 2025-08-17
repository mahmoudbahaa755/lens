<script lang="ts">
	import Table from '$lib/components/table.svelte';
	import { fetchPaginated } from '$lib/utils/api';
	import { CircleArrowRightIcon, PlusIcon } from '@lucide/svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	type Request = {
		id: string;
		data: {
			method: string;
			path: string;
			status: number;
			duration: string;
			createdAt: string;
		};
	};

	let { data: initialData } = $props();
	let requests = $state<Request[]>(initialData.requests);
	let meta = $state(initialData.meta);
	let loading = $state(false);

	async function loadMore() {
		if (loading || meta.currentPage >= meta.lastPage) {
			return;
		}

		loading = true;
		const nextPage = meta.currentPage + 1;
		const { data: newRequests, meta: newMeta } = await fetchPaginated(
			initialData.config,
			'requests',
			nextPage
		);

		requests = [...requests, ...newRequests];
		meta = newMeta;
		loading = false;
	}
</script>

{#snippet methodSnippet(request: Request)}
	<span class="rounded-lg bg-neutral-800 px-2 py-1 text-sm font-semibold text-neutral-200">
		{request.data.method}
	</span>
{/snippet}

{#snippet pathSnippet(request: Request)}
	<a
		href="./requests/{request.id}"
		class="line-clamp-2 max-w-80 min-w-40 text-base text-neutral-200 hover:underline"
	>
		{request.data.path}
	</a>
{/snippet}

{#snippet statusSnippet(request: Request)}
	{@const status = request.data.status}
	<span
		class={[
			'rounded-lg px-2 py-1 text-sm font-semibold text-neutral-200',
			status >= 200 && status < 300 && 'bg-green-700',
			status >= 300 && status < 400 && 'bg-yellow-700',
			status >= 400 && status < 500 && 'bg-red-700'
		]}
	>
		{status}
	</span>
{/snippet}

{#snippet actionsSnippet(request: Request)}
	<a href="./requests/{request.id}" class="transition-colors duration-100 hover:text-white">
		<CircleArrowRightIcon size={20} />
	</a>
{/snippet}

<main class="w-full">
	<Table
		columns={[
			{
				name: 'Method',
				render: methodSnippet
			},
			{
				name: 'Path',
				render: pathSnippet
			},
			{
				name: 'Status',
				render: statusSnippet,
				position: 'end'
			},
			{
				name: 'Duration',
				value: (request: Request) => request.data.duration,
				position: 'end'
			},
			{
				name: 'Happend',
				value: (request: Request) => dayjs(request.data.createdAt).fromNow(),
				position: 'end',
				class: 'min-w-32'
			},
			{
				name: 'Actions',
				render: actionsSnippet,
				position: 'end'
			}
		]}
		data={requests}
	/>

	{#if !requests.length}
		<p class="py-10 text-center text-neutral-400">No requests found</p>
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