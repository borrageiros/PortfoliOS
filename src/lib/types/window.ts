import type { SvelteComponent } from "svelte";

export interface WindowData {
  id: number;
  title: string;
  icon: string;
  width: string;
  height: string;
  x: number;
  y: number;
  zIndex: number;
  isMaximized: boolean;
  isMinimized: boolean;
  content: typeof SvelteComponent;
  props?: Record<string, unknown>;
  color?: string;
}