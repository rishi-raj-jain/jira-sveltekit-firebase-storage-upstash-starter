<script>
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import Button from '@/src/components/Button.svelte'

	onMount(() => {
		if ($page.data.session?.user?.image) {
			goto('/')
		}
	})
</script>

<div class="flex w-full flex-col items-center py-32">
	<div class="flex w-[320px] flex-col items-start">
		<h2 class="text-[#727272]">Welcome Back</h2>
		<h1 class="mt-1 text-xl text-white">Sign In To Your Account</h1>
		<Button id="google" name="Google" />
	</div>
</div>
