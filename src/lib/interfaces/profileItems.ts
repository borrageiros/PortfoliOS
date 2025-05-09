export interface ProfileProps {
  initialTab: typeof profileItems[number]['id'];
};

export const profileItems = [
  {
    id: 'information',
    icon: 'profile_information',
    path: 'information',
    label: 'profile.information'
  },
  {
    id: 'about',
    icon: 'profile_about',
    path: 'about',
    label: 'profile.about'
  },
  {
    id: 'carrer',
    icon: 'profile_carrer',
    path: 'carrer',
    label: 'profile.carrer'
  },
  {
    id: 'projects',
    icon: 'profile_projects',
    path: 'projects',
    label: 'profile.projects'
  },
  {
    id: 'languages',
    icon: 'profile_languages',
    path: 'languages',
    label: 'profile.languages'
  },
  {
    id: 'skills',
    icon: 'profile_skills',
    path: 'skills',
    label: 'profile.skills'
  },
  {
    id: 'informatic',
    icon: 'profile_informatic',
    path: 'informatic',
    label: 'profile.informatic'
  },
  {
    id: 'certifications',
    icon: 'profile_certifications',
    path: 'certifications',
    label: 'profile.certifications'
  },
  {
    id: 'contact',
    icon: 'profile_contact',
    path: 'contact',
    label: 'profile.contact'
  },
  {
    id: 'reviews',
    icon: 'profile_reviews',
    path: 'reviews',
    label: 'profile.reviews'
  },
  {
    id: 'complementary',
    icon: 'profile_complementary',
    path: 'complementary',
    label:'profile.complementary'
  }
];