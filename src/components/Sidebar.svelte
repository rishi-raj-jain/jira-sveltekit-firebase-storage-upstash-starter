<script lang="ts">
	import { page } from '$app/stores'
	import { signIn, signOut } from '@auth/sveltekit/client'
</script>

<div class="flex h-full w-[200px] flex-col border-r border-white/10">
	<div class="flex h-[46px] flex-row justify-between border-b border-white/10 p-3">
		{#if $page.data.session && $page.data.session.user?.image}
			<label class="flex w-full cursor-pointer flex-row justify-between" for="LogOutPopUp">
				<span class="text-sm font-medium text-white/75"> {$page.data.session.user.name} </span>
				<img alt="User Profile Pic" class="h-[20px] w-[20px] rounded-full" src={$page.data.session.user.image} />
			</label>
			<input class="hidden" type="checkbox" id="LogOutPopUp" />
			<div id="LogOutView" class="absolute left-[110px] top-[42px] rounded border border-white/10 bg-[#191A23] px-3 py-2 shadow">
				<button
					on:click={() => {
						signOut()
					}}
					class="text-sm text-white"
				>
					Log Out
				</button>
			</div>
		{:else}
			<button
				on:click={() => {
					signIn('google')
				}}
				class="text-sm font-medium text-white/75"
			>
				Log In
			</button>
			<button
				on:click={() => {
					signIn('google')
				}}
			>
				<svg width="20" height="20" viewBox="0 0 16 16" class="fill-[#858699] hover:fill-white/75">
					<path d="M8 4a2 2 0 0 0-2 2v.5a2 2 0 0 0 4 0V6a2 2 0 0 0-2-2Z" />
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm-2.879-4.121-1.01 1.01a5.5 5.5 0 1 1 7.778 0l-1.01-1.01A3 3 0 0 0 8.757 10H7.243a3 3 0 0 0-2.122.879Z"
					/>
				</svg>
			</button>
		{/if}
	</div>
	<div class="flex flex-col">
		<a href="/issue/new" class={`flex flex-row items-center gap-x-4 px-3 py-2 ${$page.url.pathname === '/issue/new' ? 'bg-gray-100/5' : 'hover:bg-gray-100/5'}`}>
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" class="fill-white/75" viewBox="0 0 16 16">
				<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
			</svg>
			<span class="text-xs font-medium text-white/75"> New Issue </span>
		</a>
		<a href="/issues" class={`flex flex-row items-center gap-x-3 px-3 py-2 ${$page.url.pathname === '/issues' ? 'bg-gray-100/5' : 'hover:bg-gray-100/5'}`}>
			<svg width="16" height="16" viewBox="0 0 16 16" class="fill-white/75">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M12.5 11.2204C13.3829 10.8346 13.9999 9.95362 13.9999 8.92853V4.5C13.9999 3.11929 12.8806 2 11.4999 2H7.07132C6.04623 2 5.16524 2.61697 4.77942 3.49983L10 3.49983C11.3807 3.49983 12.5 4.61912 12.5 5.99983V11.2204ZM4.5 13.9998C3.11929 13.9998 2 12.8805 2 11.4998V7.07126C2 5.69055 3.11929 4.57126 4.5 4.57126L8.92853 4.57126C10.3092 4.57126 11.4285 5.69055 11.4285 7.07126V11.4998C11.4285 12.8805 10.3092 13.9998 8.92853 13.9998H4.5ZM8 9.49979C8 10.3282 7.32843 10.9998 6.5 10.9998C5.67157 10.9998 5 10.3282 5 9.49979C5 8.67136 5.67157 7.99979 6.5 7.99979C7.32843 7.99979 8 8.67136 8 9.49979ZM9.5 9.49979C9.5 11.1566 8.15685 12.4998 6.5 12.4998C4.84315 12.4998 3.5 11.1566 3.5 9.49979C3.5 7.84293 4.84315 6.49979 6.5 6.49979C8.15685 6.49979 9.5 7.84293 9.5 9.49979Z"
				/>
			</svg>
			<span class="text-xs font-medium text-white/75"> Issues </span>
		</a>
		<div class="ml-3 flex border-separate flex-col">
			<a
				href="/issues/active"
				class={`py-2 pl-7 text-xs font-medium text-white/75 hover:bg-gray-100/5 ${$page.url.pathname === '/issues/active' ? 'bg-gray-100/5' : 'hover:bg-gray-100/5'}`}
			>
				Active
			</a>
			<a
				href="/issues/backlog"
				class={`py-2 pl-7 text-xs font-medium text-white/75 hover:bg-gray-100/5 ${$page.url.pathname === '/issues/backlog' ? 'bg-gray-100/5' : 'hover:bg-gray-100/5'}`}
			>
				Backlog
			</a>
		</div>
	</div>
</div>
