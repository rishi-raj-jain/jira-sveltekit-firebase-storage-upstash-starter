<script lang="ts">
	import '@/src/app.css'
	import Seo from '@/src/components/SEO.svelte'
	import Sidebar from '@/src/components/Sidebar.svelte'
</script>

<Seo />

<div class="flex h-screen w-screen flex-row overflow-hidden bg-[#191A23]">
	<Sidebar />
	<div class="flex w-[calc(100%-200px)] flex-col">
		<slot />
	</div>
</div>
