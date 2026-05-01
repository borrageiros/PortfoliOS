export interface CurrentJob {
	url: string;
	label: string;
}

export interface Coordinates {
	location: string;
	lat: number;
	lng: number;
}

export interface Information {
	photo: string;
	name: string;
	alias: string;
	birthDate: string;
	country: string;
	job: string;
	email: string;
	currentJob: CurrentJob;
	phone: string;
	location: string;
	coordinates?: Coordinates;
}

export interface About {
	title?: string;
	description: string;
	description2?: string;
	interests: string[];
	professionalGoals: string[];
}

export interface CareerStep {
	type: string;
	where: string;
	url: string;
	what: string;
	logo: string;
	from: string;
	to: string;
	description?: string[];
}

export interface Career {
	steps: CareerStep[];
}

export interface Project {
	name: string;
	description: string;
	image?: string;
	url: string;
}

export interface ProjectCategory {
	title: string;
	projects: Project[];
}

export type Projects = Record<string, ProjectCategory>;

export interface Language {
	name: string;
	flag: string;
	level: string;
	percentage: number;
}

export interface Languages {
	languages: Language[];
}

export interface Skill {
	name: string;
	items: string[];
}

export interface Skills {
	skills: Skill[];
}

export interface InformaticItem {
	name: string;
	level: string;
	icon: string;
}

export interface Informatic {
	programming: InformaticItem[];
	software: InformaticItem[];
	ai: InformaticItem[];
}

export interface Certification {
	name: string;
	issuer?: string;
	date: string;
	url: string;
	icon: string;
	expires?: string;
	important?: boolean;
}

export interface Certifications {
	certifications: Record<string, Certification[]>;
}

export interface SocialLink {
	name: string;
	icon: string;
	color: string;
	url: string;
	viewBox?: string;
}

export interface Contact {
	rrss: SocialLink[];
	email: string;
	phone?: string;
	location?: string;
}

export interface Review {
	name: string;
	job: string;
	review: string;
	url: string;
	avatar?: string;
	approved?: boolean;
}

export interface Reviews {
	reviews: Review[];
}

export interface ComplementaryProjectItem {
	name: string;
	description: string;
	url: string;
}

export interface ComplementarySection {
	title: string;
	items: (string | ComplementaryProjectItem)[];
}

export interface Complementary {
	complementary: ComplementarySection[];
}
