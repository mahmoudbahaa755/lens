<script lang="ts">
	import { CircleArrowLeftIcon, ClockIcon, InboxIcon, LinkIcon } from '@lucide/svelte';
	import dayjs from 'dayjs';

	const { data } = $props();
	const { query } = data;
	const queryData = query.data;
</script>

<svelte:head>
	<title>Lens - Query</title>
</svelte:head>

<div class="flex w-full flex-col gap-4">
	<a href="/queries" class="flex items-center gap-2 text-neutral-400 hover:text-white">
		<CircleArrowLeftIcon size={20} />
		Go back
	</a>

	<div>
		<h1 class="text-2xl font-bold">Query Details</h1>
	</div>

	<div class="rounded-lg bg-neutral-950 p-4">
		<h2 class="mb-2 text-lg font-semibold">Query</h2>
		<pre class="overflow-auto rounded-lg bg-neutral-900 p-2 text-sm"><code>{queryData.query}</code></pre>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="rounded-lg bg-neutral-950 p-4">
			<dl class="grid grid-cols-1 gap-2">
				<dt class="flex items-center gap-2 text-neutral-400"><ClockIcon size={16} /> Duration</dt>
				<dd>{queryData.duration}</dd>
				<dt class="flex items-center gap-2 text-neutral-400"><InboxIcon size={16} /> Created At</dt>
				<dd>{dayjs(queryData.createdAt).format('YYYY-MM-DD HH:mm:ss')}</dd>
			</dl>
		</div>

		<div class="rounded-lg bg-neutral-950 p-4">
			{#if query.lens_entry_id}
				<h2 class="mb-2 text-lg font-semibold">Associated Request</h2>
				<a
					href="/requests/{query.lens_entry_id}"
					class="flex items-center gap-2 text-blue-400 hover:underline"
				>
					<LinkIcon size={16} />
					View Request
				</a>
			{:else}
				<p class="text-sm text-neutral-400">No associated request.</p>
			{/if}
		</div>
	</div>
</div>
