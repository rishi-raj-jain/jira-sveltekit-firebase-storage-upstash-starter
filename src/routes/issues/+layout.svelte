<script lang="ts">
	import { page } from '$app/stores'
	import { showToast } from '@/src/lib/toast'
	import { displayDate } from '@/src/lib/date'
	import { iconStatuses, iconPriority, listStatuses } from '@/src/lib/issues/values'

	let list = false
	let current = 0
	let loading = true
	let pageName = 'All'

	let tasks: any[] = []
	let categories: { [k: string]: any } = {}

	const addTaskToCategory = (task: { status: string | null }) => {
		if (!task.status) return
		if (categories.hasOwnProperty(task.status)) {
			categories = {
				...categories,
				[task.status]: [...categories[task.status], task]
			}
		} else {
			categories = {
				...categories,
				[task.status]: [task]
			}
		}
	}

	const getCategoryLength = (name: string) => {
		try {
			const check = categories[name].length
			return check
		} catch (e) {
			return 0
		}
	}

	const getTitle = (task: { title?: string }) => {
		try {
			const check = task.title.length > 0 ? task.title : 'Untitled Task'
			return check
		} catch (e) {
			return 'Untitled Task'
		}
	}

	const populateTasks = async (slug: string, l_current: number) => {
		tasks = tasks.filter((i) => (i.status?.toLowerCase().includes(slug) ? true : false))
		const tmp = new URL('/api/issue', window.location.origin)
		tmp.searchParams.set('all', 'true')
		if (l_current !== current) return
		const call = await fetch(tmp.toString(), { method: 'GET' })
		if (call.ok) {
			if (l_current !== current) return
			const res = await call.json()
			if (res.code === 1) {
				showToast('Fetched tasks list, populating each task...')
				if (res.tasks.length === 0) loading = false
				for (let i = 0; i < res.tasks.length; i++) {
					const tmp_1 = new URL('/api/issue', window.location.origin)
					tmp_1.searchParams.set('id', res.tasks[i])
					if (l_current !== current) return
					fetch(tmp_1.toString(), { method: 'GET' })
						.then((res) => res.json())
						.then((res_1) => {
							if (l_current !== current) return
							if (slug) {
								if (res_1?.category?.toLowerCase().includes(slug)) {
									addTaskToCategory({ ...res_1, n: res.tasks[i] })
									tasks = [...tasks, { ...res_1, n: res.tasks[i] }]
								}
							} else {
								addTaskToCategory({ ...res_1, n: res.tasks[i] })
								tasks = [...tasks, { ...res_1, n: res.tasks[i] }]
							}
							if (i === res.tasks.length - 1) {
								loading = false
								showToast('Populated all tasks succesfully!')
							}
						})
				}
			} else {
				showToast(res.error)
			}
		} else {
			showToast('Failed to populate all tasks :(')
		}
	}

	const updateTasks = async (slug: string) => {
		if (slug && slug.length > 0) {
			if (slug.includes('active')) {
				pageName = 'Active'
			}
			if (slug.includes('backlog')) {
				pageName = 'Backlog'
			} else {
				pageName = 'All'
			}
		} else {
			pageName = 'All'
		}
		if (typeof document !== 'undefined') {
			showToast('Loading tasks...')
			tasks = []
			categories = {}
			current += 1
			loading = true
			await populateTasks(slug, current)
		}
	}

	$: updateTasks($page.params.slug)
</script>

<div class="flex h-screen w-full flex-row overflow-hidden bg-[#191A23]">
	<div class="flex h-full w-full flex-col">
		<div class="flex h-[46px] flex-row justify-between border-b border-white/10 p-3">
			<span class="text-sm font-medium text-white/75"> {pageName} Issues </span>
			<div class="flex flex-row items-center gap-x-2">
				<button
					on:click={() => {
						list = true
					}}
					class="rounded bg-white/5 px-2 py-1 hover:bg-white/10"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" class={`scale-y-125 ${list ? 'fill-white' : 'fill-white/50'}`} viewBox="0 0 16 16">
						<path
							fill-rule="evenodd"
							d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
						/>
					</svg>
				</button>
				<button
					on:click={() => {
						list = false
					}}
					class="rounded bg-white/5 px-2 py-1 hover:bg-white/10"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" class={!list ? 'fill-white' : 'fill-white/50'} viewBox="0 0 16 16">
						<path
							d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"
						/>
					</svg>
				</button>
			</div>
		</div>
		{#if loading}
			<div class="flex w-full flex-row items-center justify-between border-b border-white/5 px-3 py-3 hover:bg-gray-100/5">
				<div class="flex flex-row items-center gap-x-2">
					<div class="h-[15px] w-[15px] animate-pulse rounded-full bg-white/50" />
					<span class="animate-pulse bg-white/50 text-sm text-transparent"> Untitled Task </span>
				</div>
				<span class="animate-pulse bg-white/50 text-sm text-transparent"> No Due Date </span>
			</div>
			<div class="flex w-full flex-row items-center justify-between border-b border-white/5 px-3 py-3 hover:bg-gray-100/5">
				<div class="flex flex-row items-center gap-x-2">
					<div class="h-[15px] w-[15px] animate-pulse rounded-full bg-white/50" />
					<span class="animate-pulse bg-white/50 text-sm text-transparent"> Untitled Task </span>
				</div>
				<span class="animate-pulse bg-white/50 text-sm text-transparent"> No Due Date </span>
			</div>
			<div class="flex w-full flex-row items-center justify-between border-b border-white/5 px-3 py-3 hover:bg-gray-100/5">
				<div class="flex flex-row items-center gap-x-2">
					<div class="h-[15px] w-[15px] animate-pulse rounded-full bg-white/50" />
					<span class="animate-pulse bg-white/50 text-sm text-transparent"> Untitled Task </span>
				</div>
				<span class="animate-pulse bg-white/50 text-sm text-transparent"> No Due Date </span>
			</div>
		{:else if list && !loading}
			{#each listStatuses as category}
				<div class="flex w-full flex-row items-center justify-between border-b border-white/5 bg-white/5 px-3 py-2">
					<div class="flex flex-row items-center gap-x-2">
						{@html iconStatuses[category]}
						<div class="flex flex-row items-center gap-x-2 text-sm">
							<span class="text-white">
								{category}
							</span>
							<span class="text-white/50">
								({getCategoryLength(category)})
							</span>
						</div>
					</div>
					<a href={`/issue/new?status=${category}`} class="p-1 hover:bg-gray-100/5">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="fill-white" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
						</svg>
					</a>
				</div>
				{#if getCategoryLength(category) > 0}
					{#each categories[category] as task}
						<a href={`/issue/${task.n}`} class="flex w-full flex-row items-center justify-between border-b border-white/5 px-3 py-3 hover:bg-gray-100/5">
							<div class="flex flex-row items-center gap-x-3">
								{#if task.priority}
									{@html iconPriority[task.priority]}
								{/if}
								{@html iconStatuses[category]}
								<span class="text-sm text-white">
									{getTitle(task)}
								</span>
							</div>
							<span class="text-sm text-white/50">
								{displayDate(task)}
							</span>
						</a>
					{/each}
				{/if}
			{/each}
		{:else if !list && !loading}
			<div class="flex min-h-[80vh] flex-col overflow-x-scroll">
				<div class="ml-3 mr-3 mt-3 flex min-w-min flex-row items-start gap-x-3">
					{#each listStatuses as category}
						<div class="flex w-[300px] flex-col gap-y-3">
							<div class="flex w-full flex-row items-center justify-between border-b border-white/5 bg-white/5 px-3 py-2">
								<div class="flex flex-row items-center gap-x-2">
									{@html iconStatuses[category]}
									<div class="flex flex-row items-center gap-x-2 text-sm">
										<span class="text-white">
											{category}
										</span>
										<span class="text-white/50">
											({getCategoryLength(category)})
										</span>
									</div>
								</div>
								<a href={`/issue/new?status=${category}`} class="p-1 hover:bg-gray-100/5">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="fill-white" viewBox="0 0 16 16">
										<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
									</svg>
								</a>
							</div>
							{#if getCategoryLength(category) > 0}
								{#each categories[category] as task}
									<a href={`/issue/${task.n}`} class="flex w-full flex-col rounded border border-white/5 px-3 py-3 hover:bg-gray-100/5">
										<span class="text-sm text-white">
											{getTitle(task)}
										</span>
										<div class="mt-3 flex flex-row items-center gap-x-3 overflow-x-scroll text-sm text-white/50">
											{#if task.priority}
												{@html iconPriority[task.priority]}
											{/if}
											{#if task.due}
												<div class="flex flex-row items-center gap-x-1 rounded border border-white/25 px-1 py-0.5 text-sm">
													<svg width="10" height="10" viewBox="0 0 16 16" fill="#858699" style="fill: rgb(242, 153, 74);">
														<path
															d="M11 1C13.2091 1 15 2.79086 15 5V11C15 13.2091 13.2091 15 11 15H5C2.79086 15 1 13.2091 1 11V5C1 2.79086 2.79086 1 5 1H11ZM13.5 6H2.5V11C2.5 12.3807 3.61929 13.5 5 13.5H11C12.3807 13.5 13.5 12.3807 13.5 11V6Z"
														/>
													</svg>
													<span class="text-xs">
														{displayDate(task)}
													</span>
												</div>
											{/if}
										</div>
									</a>
								{/each}
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
		<slot />
	</div>
</div>
