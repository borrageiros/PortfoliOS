<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { loadData } from '../../../helpers';
	import { locale } from '$lib/i18n/i18n';
	import { t } from '$lib/i18n/i18n';
	import Icon from '$lib/components/Icon.svelte';
	import { profileItems, type ProfileProps } from '$lib/interfaces/profileItems';
	import Information from './Information.svelte';
	import About from './About.svelte';
	import Career from './Career.svelte';
	import Projects from './Projects.svelte';
	import Languages from './Languages.svelte';
	import Skills from './Skills.svelte';
	import Informatic from './Informatic.svelte';
	import Certifications from './Certifications.svelte';
	import Contact from './Contact.svelte';
	import Reviews from './Reviews.svelte';
	import Complementary from './Complementary.svelte';
	import type {
		Information as InformationData,
		About as AboutData,
		Career as CareerData,
		Projects as ProjectsData,
		Languages as LanguagesData,
		Skills as SkillsData,
		Informatic as InformaticData,
		Certifications as CertificationsData,
		Contact as ContactData,
		Reviews as ReviewsData,
		Complementary as ComplementaryData
	} from '$lib/types/data';

	export let initialTab: ProfileProps['initialTab'] = 'information';
	const validProfileTabs = new Set(profileItems.map((item) => item.id));

	// State to store loaded data
	let information: InformationData | null = null;
	let about: AboutData | null = null;
	let career: CareerData | null = null;
	let projects: ProjectsData | null = null;
	let languages: LanguagesData | null = null;
	let skills: SkillsData | null = null;
	let informatic: InformaticData | null = null;
	let certifications: CertificationsData | null = null;
	let contact: ContactData | null = null;
	let reviews: ReviewsData | null = null;
	let complementary: ComplementaryData | null = null;

	// State for the active menu
	let activeMenu = initialTab;
	$: if (initialTab && validProfileTabs.has(initialTab)) {
		activeMenu = initialTab;
	}

	// Function to load all data
	async function loadAllData() {
		information = await loadData<InformationData>('information');
		about = await loadData<AboutData>('about');
		career = await loadData<CareerData>('career');
		projects = await loadData<ProjectsData>('projects');
		languages = await loadData<LanguagesData>('languages');
		skills = await loadData<SkillsData>('skills');
		informatic = await loadData<InformaticData>('informatic');
		certifications = await loadData<CertificationsData>('certifications');
		contact = await loadData<ContactData>('contact');
		reviews = await loadData<ReviewsData>('reviews');
		complementary = await loadData<ComplementaryData>('complementary');
	}

	// Function to change the active menu
	function setActiveMenu(menu: ProfileProps['initialTab']) {
		activeMenu = menu;
		const params = new URLSearchParams($page.url.searchParams);
		params.set('profile', menu);
		goto(`${$page.url.pathname}?${params.toString()}`, {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
		const contentArea = document.querySelector('.content-area');
		if (contentArea) {
			contentArea.scrollTop = 0;
		}
	}

	onMount(() => {
		loadAllData();
		const unsubscribe = locale.subscribe(() => {
			loadAllData();
		});
		return () => {
			unsubscribe();
		};
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			//
		}
	}
</script>

<div class="profile-container">
	<div class="sidebar">
		<div class="menu-header">
			<span>{(information && information.alias) || ''}</span>
		</div>
		<div class="menu-items">
			{#each profileItems as item (item.id)}
				<div
					class="menu-item {activeMenu === item.id ? 'active' : ''}"
					on:click={() => setActiveMenu(item.id as ProfileProps['initialTab'])}
					on:keydown={handleKeydown}
					role="button"
					tabindex="0"
				>
					<Icon name={item.icon} size="18" />
					<span>{$t(item.label)}</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="content-area">
		{#if activeMenu === 'information' && information}
			<Information {information} />
		{:else if activeMenu === 'about' && about}
			<About {about} />
		{:else if activeMenu === 'career' && career}
			<Career {career} />
		{:else if activeMenu === 'projects' && projects}
			<Projects {projects} />
		{:else if activeMenu === 'languages' && languages}
			<Languages {languages} />
		{:else if activeMenu === 'skills' && skills}
			<Skills {skills} />
		{:else if activeMenu === 'informatic' && informatic}
			<Informatic {informatic} />
		{:else if activeMenu === 'certifications' && certifications}
			<Certifications {certifications} />
		{:else if activeMenu === 'contact' && contact}
			<Contact {contact} />
		{:else if activeMenu === 'reviews' && reviews}
			<Reviews {reviews} />
		{:else if activeMenu === 'complementary' && complementary}
			<Complementary {complementary} />
		{:else}
			<div class="loading">
				<span>{$t('profile.loading')}</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.profile-container {
		width: 100%;
		height: 100%;
		display: flex;
		background-color: var(--window-bg);
		color: var(--text-primary);
		overflow: hidden;
	}

	.sidebar {
		width: 220px;
		background-color: var(--window-header);
		border-right: 1px solid var(--taskbar-active);
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--taskbar-active) var(--window-header);
	}

	.sidebar::-webkit-scrollbar {
		width: 8px;
	}

	.sidebar::-webkit-scrollbar-track {
		background: var(--window-header);
	}

	.sidebar::-webkit-scrollbar-thumb {
		background-color: var(--taskbar-active);
		border-radius: 4px;
		border: 2px solid var(--window-header);
	}

	.sidebar::-webkit-scrollbar-thumb:hover {
		background-color: var(--win-accent);
	}

	.menu-header {
		padding: 15px;
		font-size: 16px;
		font-weight: bold;
		color: var(--text-primary);
		padding-bottom: 12px;
		padding-top: 12px;
	}

	.menu-items {
		display: flex;
		flex-direction: column;
	}

	.menu-item {
		padding: 12px 15px;
		cursor: pointer;
		transition: background-color 0.2s ease;
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.menu-item:hover {
		background-color: var(--taskbar-hover);
	}

	.menu-item.active {
		background-color: var(--win-accent);
		color: white;
	}

	.content-area {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--taskbar-active) var(--window-bg);
	}

	.content-area::-webkit-scrollbar {
		width: 10px;
	}

	.content-area::-webkit-scrollbar-track {
		background: var(--window-bg);
		border-radius: 4px;
	}

	.content-area::-webkit-scrollbar-thumb {
		background-color: var(--taskbar-active);
		border-radius: 4px;
		border: 2px solid var(--window-bg);
	}

	.content-area::-webkit-scrollbar-thumb:hover {
		background-color: var(--win-accent);
	}

	/* Loading state */
	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 18px;
		color: var(--text-secondary);
	}
</style>
