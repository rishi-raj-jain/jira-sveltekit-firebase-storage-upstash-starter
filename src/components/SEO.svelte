<script lang="ts">
	import { page } from '$app/stores'
	import { getDescription, getTitle } from '@/src/lib/utils'

	$: title = getTitle($page.data?.seo?.title)
	$: pathname = $page.data?.seo?.pathname ?? ''
	$: description = getDescription($page.data?.seo?.description)
	$: domain = typeof window !== 'undefined' ? window.location.origin : ''
</script>

<svelte:head>
	<!-- Global Metadata -->
	<meta charset="utf-8" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta name="viewport" content="width=device-width,initial-scale=1" />
	<!-- Primary Meta Tags -->
	{#if title}
		<title>{title}</title>
		<meta name="title" content={title} />
	{/if}
	{#if description}
		<meta name="description" content={description} />
	{/if}
	<!-- Open Graph / Facebook -->
	{#if title}
		<meta property="og:title" content={title} />
	{/if}
	<meta property="og:type" content="website" />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	{#if domain && pathname}
		<meta property="og:url" content={domain + pathname} />
	{/if}
	<!-- Twitter -->
	{#if title}
		<meta property="twitter:title" content={title} />
	{/if}
	{#if description}
		<meta property="twitter:description" content={description} />
	{/if}
	<meta property="twitter:card" content="summary_large_image" />
	{#if domain && pathname}
		<meta property="twitter:url" content={domain + pathname} />
	{/if}
</svelte:head>
