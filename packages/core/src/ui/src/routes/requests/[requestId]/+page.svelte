<script lang="ts">
	import { CircleArrowLeftIcon, ClockIcon, HashIcon, InboxIcon, VenetianMaskIcon } from '@lucide/svelte';
	import dayjs from 'dayjs';

    const { data: propsData } = $props();
    const { request: requestData, queries, user, config } = propsData;
    const responseData = requestData.data.response;

    console.log('request', requestData)
</script>

<svelte:head>
	<title>Lens - Request</title>
</svelte:head>

<div class="flex w-full flex-col gap-4">
	<a href="/requests" class="flex items-center gap-2 text-neutral-400 hover:text-white">
		<CircleArrowLeftIcon size={20} />
		Go back
	</a>

	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">{requestData.path}</h1>
			<p class="text-neutral-400">Request details</p>
		</div>

		<div class="flex items-center gap-2">
			<span class="rounded-lg bg-neutral-800 px-2 py-1 text-sm font-semibold text-neutral-200">
				{requestData.method}
			</span>
			<span
				class={[
					'rounded-lg px-2 py-1 text-sm font-semibold text-neutral-200',
					requestData.status >= 100 && requestData.status < 200 && 'bg-grey-700',
					requestData.status >= 200 && requestData.status < 300 && 'bg-green-700',
					requestData.status >= 300 && requestData.status < 400 && 'bg-blue-600',
					requestData.status >= 400 && requestData.status < 500 && 'bg-yellow-700',
					requestData.status >= 500 && 'bg-red-700'
				]}
			>
				{requestData.status}
			</span>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		<div class="col-span-2 flex flex-col gap-4">
			<div class="rounded-lg bg-neutral-950 p-4">
				<h2 class="mb-2 text-lg font-semibold">Request</h2>
				<dl class="grid grid-cols-2 gap-2">
					<dt class="flex items-center gap-2 text-neutral-400"><ClockIcon size={16} /> Duration</dt>
					<dd>{requestData.duration}</dd>
					<dt class="flex items-center gap-2 text-neutral-400"><VenetianMaskIcon size={16} /> IP Address</dt>
					<dd>{requestData.ip}</dd>
					<dt class="flex items-center gap-2 text-neutral-400"><InboxIcon size={16} /> Created At</dt>
					<dd>{dayjs(requestData.createdAt).format('YYYY-MM-DD HH:mm:ss')}</dd>
				</dl>
			</div>

			<div class="rounded-lg bg-neutral-950 p-4">
				<h2 class="mb-2 text-lg font-semibold">Headers</h2>
				<pre
					class="overflow-auto rounded-lg bg-neutral-900 p-2 text-sm"><code>{JSON.stringify(requestData.headers, null, 2)}</code></pre>
			</div>

			<div class="rounded-lg bg-neutral-950 p-4">
				<h2 class="mb-2 text-lg font-semibold">Body</h2>
				<pre
					class="overflow-auto rounded-lg bg-neutral-900 p-2 text-sm"><code>{JSON.stringify(requestData.body, null, 2)}</code></pre>
			</div>

			<div class="rounded-lg bg-neutral-950 p-4">
				<h2 class="mb-2 text-lg font-semibold">Response</h2>
				<pre
					class="overflow-auto rounded-lg bg-neutral-900 p-2 text-sm"><code>{JSON.stringify(responseData.json, null, 2)}</code></pre>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			{#if user}
				<div class="rounded-lg bg-neutral-950 p-4">
					<h2 class="mb-2 text-lg font-semibold">User</h2>
					<dl class="grid grid-cols-1 gap-2">
						<dt class="flex items-center gap-2 text-neutral-400"><HashIcon size={16} /> ID</dt>
						<dd>{user.id}</dd>
						<dt class="flex items-center gap-2 text-neutral-400"><InboxIcon size={16} /> Email</dt>
						<dd>{user.email}</dd>
					</dl>
				</div>
			{/if}

			<div class="rounded-lg bg-neutral-950 p-4">
				<h2 class="mb-2 text-lg font-semibold">Queries</h2>
				{#if queries.length}
					<ul class="flex flex-col gap-2">
						{#each queries as query}
							<li class="rounded-lg bg-neutral-900 p-2">
								<p class="truncate text-sm text-neutral-300">{query.data.query}</p>
								<div class="flex items-center justify-between text-xs text-neutral-500">
									<span>{query.data.duration}</span>
									<a href="{config.path}/queries/{query.id}" class="hover:underline">View</a>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-sm text-neutral-400">No queries for this request.</p>
				{/if}
			</div>
		</div>
	</div>
</div>
