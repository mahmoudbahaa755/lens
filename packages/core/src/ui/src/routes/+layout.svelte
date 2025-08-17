<script lang="ts">
    import { lensConfig } from '$lib/stores/config';
    import { get } from 'svelte/store';
    import { ArrowRightLeftIcon, DatabaseIcon } from '@lucide/svelte';
    import '../app.css';

    let { children, data } = $props();

    lensConfig.set(data.config);

    const basePath = get(lensConfig)?.path ?? '';

    const routes = [
        { label: 'Requests', path: `${basePath}/requests`, icon: ArrowRightLeftIcon },
        { label: 'Queries', path: `${basePath}/queries`, icon: DatabaseIcon }
    ];
</script>

<svelte:head>
    <title>Lens</title>
</svelte:head>

<header class="container my-5 flex items-center justify-between gap-4">
    <a href={`${basePath}/requests`}>
        <p class="text-2xl font-bold">🔭 Lens</p>
    </a>
</header>

<hr class="container my-6 border-neutral-800" />

<div class="container flex gap-8">
    <aside class="min-w-60 sticky top-0">
        <ul class="flex flex-col gap-2 text-neutral-300">
            {#each routes as route}
                {@const active = route.path === data.path}
                <li class="contents">
                    <a
                        href={route.path}
                        class={[
                            'flex items-center gap-2 rounded-lg px-3 py-2 font-medium',
                            active
                                ? 'bg-neutral-950 text-white'
                                : 'text-neutral-500 hover:bg-neutral-950'
                        ]}
                    >
                        <route.icon size={16} />
                        {route.label}
                    </a>
                </li>
            {/each}
        </ul>
    </aside>
    {@render children()}
</div>
