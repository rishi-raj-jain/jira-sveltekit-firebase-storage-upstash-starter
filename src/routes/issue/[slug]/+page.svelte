<script lang="ts">
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { showToast } from '@/src/lib/toast'
	import Upload from '@/src/components/Upload.svelte'
	import { copyTextToClipboard } from '@/src/lib/copy'
	import { toDateFromLocaleDateString } from '@/src/lib/date'
	import { iconPriority, iconCategories, iconStatuses, listCategories, listPriority, listStatuses } from '@/src/lib/issues/values'

	let fieldFiles: any = []
	let fieldTitle: string = ''
	let fieldDescription: string = ''
	let fieldStatus: string = listStatuses[0]
	let fieldPriority: string = listPriority[0]
	let fieldCategory: string = listCategories[0]
	let fieldDue: string = new Date().toLocaleDateString()

	let task: { [name: string]: string } = {
		due: '',
		title: '',
		status: '',
		priority: '',
		category: '',
		description: ''
	}

	const updateTaskLocally = (k: string, v: any) => {
		task = {
			...task,
			[k]: v
		}
	}

	$: updateTaskLocally('due', fieldDue)
	$: updateTaskLocally('title', fieldTitle)
	$: updateTaskLocally('status', fieldStatus)
	$: updateTaskLocally('category', fieldCategory)
	$: updateTaskLocally('priority', fieldPriority)
	$: updateTaskLocally('description', fieldDescription)

	let doneTypingInterval = 300
	let typingTimer: ReturnType<typeof setTimeout>

	const perform = (slug: string) => {
		if (typeof document !== 'undefined') {
			if (slug === 'new') {
				showToast('Creating a new issue...', 2000)
				const statusFromURL = $page.url.searchParams.get('status')
				if (statusFromURL) {
					task = {
						...task,
						status: statusFromURL ? (listStatuses.includes(statusFromURL) ? statusFromURL : listStatuses[0]) : listStatuses[0]
					}
				}
				fetch('/api/issue', { method: 'POST', body: JSON.stringify({ info: task }) })
					.then((res) => {
						return res.json()
					})
					.then((res) => {
						if (res.code === 1) {
							goto(`/issue/${res.id}`, { replaceState: true })
							showToast(res.message)
						} else {
							showToast(res.error)
						}
					})
			} else {
				refreshTask(slug)
			}
		}
	}

	$: perform($page.params.slug)

	const startSaveTimeout = () => {
		if (typingTimer) clearTimeout(typingTimer)
		typingTimer = setTimeout(() => {
			saveTask()
		}, doneTypingInterval)
	}

	const refreshTask = (slug?: string, flag?: number = 0) => {
		if (flag === 1) {
			showToast(`Refreshing Task...`)
		}
		const tmp = new URL('/api/issue', window.location.origin)
		tmp.searchParams.set('id', slug ?? $page.params.slug)
		fetch(tmp.toString(), { method: 'GET' })
			.then((res) => res.json())
			.then((res) => {
				if (res.code === 1) {
					const { files: getFiles, due: getDue, title: getTitle, description: getDescription, status: getStatus, priority: getPriority, category: getCategory } = res
					fieldTitle = getTitle ?? ''
					fieldDescription = getDescription ?? ''
					fieldStatus = getStatus ? (listStatuses.includes(getStatus) ? getStatus : listStatuses[0]) : listStatuses[0]
					fieldPriority = getPriority ? (listPriority.includes(getPriority) ? getPriority : listPriority[0]) : listPriority[0]
					fieldCategory = getCategory ? (listCategories.includes(getCategory) ? getCategory : listCategories[0]) : listCategories[0]
					const regexPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/
					if (getDue?.length) {
						if (getDue.match(regexPattern)) {
							fieldDue = getDue
						} else {
							fieldDue = new Date().toLocaleDateString()
						}
					} else {
						fieldDue = new Date().toLocaleDateString()
					}
					showToast(`${flag === 1 ? 'Refresh' : 'Loaded'} succesfully!`)
					if (getFiles && getFiles.length > 0) {
						getFiles.forEach((fileURLString: string) => {
							const fileURL = new URL('/api/content', window.location.origin)
							fileURL.searchParams.set('image', fileURLString)
							fetch(fileURL.toString(), { method: 'GET' })
								.then((res) => res.json())
								.then((res) => {
									if (res.code === 1) {
										fieldFiles = [...fieldFiles, res.image]
									}
								})
						})
					}
				} else {
					showToast(res.error)
					goto('/404')
				}
			})
	}

	const saveTask = () => {
		if ($page.params.slug !== 'new') {
			fetch('/api/issue', { method: 'PUT', body: JSON.stringify({ info: task, id: $page.params.slug }) })
				.then((res) => res.json())
				.then((res) => {
					if (res.code === 1) {
						showToast(res.message)
					} else {
						showToast(res.error)
					}
				})
		}
	}

	const deleteTask = () => {
		const tmp = new URL('/api/issue', window.location.origin)
		tmp.searchParams.set('id', $page.params.slug)
		fetch(tmp.toString(), { method: 'DELETE' })
			.then((res) => res.json())
			.then((res) => {
				if (res.code === 1) {
					showToast(res.message)
					goto('/')
				} else {
					showToast(res.error)
				}
			})
	}
</script>

<svelte:head>
	<title>{fieldTitle} - jira-sveltekit-firebase-storage-upstash-starter</title>
</svelte:head>

<div class="flex w-full flex-row overflow-hidden">
	<div class="flex w-full flex-col">
		<div class="flex min-h-[45px] w-full flex-row items-center justify-between px-3">
			<Upload taskID={$page.params.slug} />
			<button
				on:click={() => {
					refreshTask($page.params.slug, 1)
				}}
				class="flex appearance-none flex-row items-center gap-x-3 fill-[#858699] p-1 text-[#858699] hover:bg-gray-100/5 hover:fill-white hover:text-white"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
					<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
				</svg>
				<span> Refresh</span>
			</button>
		</div>
		<div class="h-[1px] w-full bg-white/10">&nbsp;&nbsp;</div>
		<div class="flex w-full flex-col p-3 overflow-y-auto">
			<input
				type="text"
				bind:value={fieldTitle}
				placeholder="Issue Title"
				on:keyup={startSaveTimeout}
				on:keydown={startSaveTimeout}
				class="rounded bg-transparent px-5 py-2 text-lg text-white outline-none placeholder:text-gray-600 border border-transparent hover:border-[#6C79FF] focus:border focus:border-[#6C79FF]"
			/>

			<textarea
				on:keyup={startSaveTimeout}
				on:keydown={startSaveTimeout}
				bind:value={fieldDescription}
				placeholder="Issue Description"
				class="text-md mt-4 min-h-[calc(100vh-150px)] rounded bg-transparent p-5 text-white outline-none placeholder:text-gray-600 hover:border hover:border-[#6C79FF] focus:border focus:border-[#6C79FF]"
			/>

			{#if fieldFiles}
				{#each fieldFiles as file}
					<div class="mt-8 w-full border border-white/25 p-3">
						{#if /\.(mp4|mov|mkv)/i.test(file)}
							<video class="h-auto w-full" src={file} controls>
								<track kind="captions" />
							</video>
						{:else}
							<img alt={file} src={file} class="h-auto w-full" />
						{/if}
					</div>
				{/each}
				<div class="mt-2 h-[1px] w-full bg-transparent text-transparent">&nbsp;</div>
			{/if}
		</div>
	</div>

	<div class="flex min-h-screen w-[250px] flex-col border-l border-white/10">
		<div class="flex h-[46px] flex-row items-center justify-between border-b border-white/10 px-3">
			<div class="flex flex-row items-center gap-x-4">
				<button
					on:click={() => {
						copyTextToClipboard(
							window.location.href,
							`<span>Issue "${$page.params.slug}" URL copied to clipboard</span> <span class="mt-1 text-xs text-gray-500">Paste it wherever you like.</span>`
						)
					}}
					class="appearance-none fill-[#858699] p-1 hover:bg-gray-100/5 hover:fill-white"
				>
					<svg width="16" height="16" viewBox="0 0 16 16">
						<path
							d="M9.30558 10.206C9.57224 10.4726 9.59447 10.8912 9.37225 11.1831L9.30558 11.2594L6.84751 13.7175C5.58692 14.9781 3.54311 14.9781 2.28252 13.7175C1.0654 12.5004 1.02344 10.5531 2.15661 9.28564L2.28252 9.15251L4.74059 6.69443C5.0315 6.40353 5.50315 6.40353 5.79405 6.69443C6.06071 6.9611 6.08294 7.37963 5.86072 7.67161L5.79405 7.74789L3.33598 10.206C2.6572 10.8847 2.6572 11.9853 3.33598 12.664C3.98082 13.3089 5.00628 13.3411 5.68918 12.7608L5.79405 12.664L8.25212 10.206C8.54303 9.91506 9.01468 9.91506 9.30558 10.206ZM9.82982 6.17019C10.1207 6.46109 10.1207 6.93274 9.82982 7.22365L7.34921 9.70427C7.0583 9.99518 6.58665 9.99518 6.29575 9.70427C6.00484 9.41337 6.00484 8.94172 6.29575 8.65081L8.77637 6.17019C9.06727 5.87928 9.53892 5.87928 9.82982 6.17019ZM13.7175 2.2825C14.9346 3.49962 14.9766 5.44688 13.8434 6.71436L13.7175 6.84749L11.2594 9.30557C10.9685 9.59647 10.4969 9.59647 10.206 9.30557C9.93931 9.03891 9.91709 8.62037 10.1393 8.32839L10.206 8.25211L12.664 5.79403C13.3428 5.11525 13.3428 4.01474 12.664 3.33596C12.0192 2.69112 10.9938 2.65888 10.3109 3.23923L10.206 3.33596L7.74791 5.79403C7.457 6.08494 6.98535 6.08494 6.69445 5.79403C6.42779 5.52737 6.40556 5.10883 6.62778 4.81686L6.69445 4.74057L9.15252 2.2825C10.4131 1.02191 12.4569 1.02191 13.7175 2.2825Z"
						/>
					</svg>
				</button>
				<button
					on:click={() => {
						copyTextToClipboard(
							$page.params.slug,
							`<span>"${$page.params.slug}" copied to clipboard</span> <span class="mt-1 text-xs text-gray-500">Paste it wherever you like.</span>`
						)
					}}
					class="appearance-none fill-[#858699] p-1 hover:bg-gray-100/5 hover:fill-white"
				>
					<svg width="16" height="16" viewBox="0 0 16 16">
						<path
							d="M8.963 2.452v1.16c0 .16-.13.29-.29.291h-3.48a.292.292 0 0 1-.292-.292v-1.16c0-.16.13-.291.292-.291h.44a.145.145 0 0 0 .145-.13 1.16 1.16 0 0 1 2.306 0c.009.074.071.13.145.13h.443c.16 0 .291.13.291.292ZM7.223 13.405c0-.4-.325-.725-.726-.725H4.032a.626.626 0 0 1-.583-.663V4.561a.634.634 0 0 1 .491-.65.146.146 0 0 0 .117-.151c-.023-.447-.03-.933-.032-1.167a.146.146 0 0 0-.146-.144H2.875A.871.871 0 0 0 2 3.317v9.942c0 .482.39.871.87.871h3.627c.401 0 .726-.324.726-.725ZM9.817 3.76a.146.146 0 0 0 .117.154.635.635 0 0 1 .48.647v.816a.726.726 0 0 0 1.452.001V3.321a.871.871 0 0 0-.871-.871h-1.01a.145.145 0 0 0-.146.146c.002.276.001.87-.022 1.164ZM12.593 11.842a.5.5 0 0 0-.5-.5h-1.5a.5.5 0 1 0 0 1h1.5a.5.5 0 0 0 .5-.5ZM12.593 10.342a.5.5 0 0 0-.5-.5h-1.5a.5.5 0 1 0 0 1h1.5a.5.5 0 0 0 .5-.5Z"
						/>
						<path
							d="M13.667 7.357a1.75 1.75 0 0 0-1.24-.514H9.594a1.75 1.75 0 0 0-1.75 1.75v4.25c0 .966.783 1.75 1.75 1.75h3.5a1.75 1.75 0 0 0 1.75-1.75V9.26a1.75 1.75 0 0 0-.51-1.236l-.666-.667Zm-4.074.986h2.835a.25.25 0 0 1 .177.073l.665.667a.25.25 0 0 1 .073.177v3.582a.25.25 0 0 1-.25.25h-3.5a.25.25 0 0 1-.25-.25v-4.25a.25.25 0 0 1 .25-.25Z"
						/>
					</svg>
				</button>
			</div>
			<button on:click={deleteTask} class="appearance-none fill-[#858699] p-1 hover:bg-gray-100/5 hover:fill-white">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
					<path
						d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"
					/>
					<path
						d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
					/>
				</svg>
			</button>
		</div>
		<div class="flex w-[300px] flex-col">
			<div class="flex flex-row items-center gap-x-8 border-b border-white/10 px-3 py-3">
				<span class="text-sm font-medium text-white/75"> Status </span>
				<div class="flex flex-row items-center gap-x-2">
					{@html iconStatuses[fieldStatus]}
					<select
						value={fieldStatus}
						on:change={(e) => {
							fieldStatus = e.target.value
							startSaveTimeout()
						}}
						class="w-[100px] appearance-none rounded border border-transparent bg-transparent px-2 py-1 text-sm text-white/75 outline-none hover:border-white/10 hover:bg-gray-100/5"
					>
						{#each listStatuses as statusPossible}
							<option value={statusPossible}> {statusPossible} </option>
						{/each}
					</select>
				</div>
			</div>
			<div class="flex flex-row items-center gap-x-7 border-b border-white/10 px-3 py-3">
				<span class="text-sm font-medium text-white/75"> Priority </span>
				<div class="flex flex-row items-center gap-x-2">
					{@html iconPriority[fieldPriority]}
					<select
						value={fieldPriority}
						on:change={(e) => {
							fieldPriority = e.target.value
							startSaveTimeout()
						}}
						class="w-[100px] appearance-none rounded bg-transparent px-2 py-1 text-sm text-white/75 outline-none hover:bg-gray-100/5"
					>
						{#each listPriority as statusPriority}
							<option value={statusPriority}> {statusPriority} </option>
						{/each}
					</select>
				</div>
			</div>
			<div class="flex flex-row items-center gap-x-5 border-b border-white/10 py-3 pl-3">
				<span class="min-w-min text-sm font-medium text-white/75"> Due Date </span>
				<input
					type="date"
					value={toDateFromLocaleDateString(fieldDue)}
					on:change={(e) => {
						fieldDue = new Date(e.target.value).toLocaleDateString()
						startSaveTimeout()
					}}
					class="picker border border-transparent text-sm text-white/75 outline-none hover:border-white/10 hover:bg-gray-100/5"
				/>
			</div>
			<div class="flex flex-row items-center gap-x-11 border-b border-white/10 px-3 py-3">
				<span class="text-sm font-medium text-white/75"> Type </span>
				<div class="flex flex-row items-center gap-x-2">
					{@html iconCategories[fieldCategory]}
					<select
						value={fieldCategory}
						on:change={(e) => {
							fieldCategory = e.target.value
							startSaveTimeout()
						}}
						class="w-[100px] appearance-none rounded bg-transparent px-2 py-1 text-sm text-white/75 outline-none hover:bg-gray-100/5"
					>
						{#each listCategories as taskCategory}
							<option value={taskCategory}> {taskCategory} </option>
						{/each}
					</select>
				</div>
			</div>
		</div>
	</div>
</div>
