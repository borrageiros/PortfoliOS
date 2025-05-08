import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

// Detectar tema del sistema
function detectSystemTheme(): Theme {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Default theme for SSR
}

// Inicializar el tema desde localStorage o sistema
function initTheme(): Theme {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return detectSystemTheme();
  }
  return 'dark';
}

// Store para el tema actual
export const theme = writable<Theme>(initTheme());

// Guardar el tema en localStorage cuando cambie
theme.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', value);
    updateThemeClass(value);
  }
});

// Actualizar la clase del html para aplicar estilos CSS
function updateThemeClass(currentTheme: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    document.documentElement.classList.add(`${currentTheme}-theme`);
  }
}

// Función para cambiar el tema
export function toggleTheme() {
  theme.update(t => t === 'light' ? 'dark' : 'light');
}

// Función para obtener el icono del tema actual
export function getThemeIcon(currentTheme: Theme) {
  return currentTheme === 'light' ? 'sun' : 'moon';
} 