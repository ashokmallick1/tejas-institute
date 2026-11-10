import type { DomainProject } from './projects';
import { ALL_PROJECTS as AI_PROJECTS, PROJECTS_BY_PROGRAM as AI_BY_PROGRAM } from './projects';
import { CLOUD_PROJECTS, CLOUD_PROJECTS_BY_PROGRAM } from './projects-cloud';
import { HARDWARE_PROJECTS, HARDWARE_PROJECTS_BY_PROGRAM } from './projects-hardware';

export type { DomainProject };

export const ALL_PROJECTS: DomainProject[] = [
  ...AI_PROJECTS,
  ...CLOUD_PROJECTS,
  ...HARDWARE_PROJECTS,
];

export const PROJECTS_BY_PROGRAM: Record<string, DomainProject[]> = {
  ...AI_BY_PROGRAM,
  ...CLOUD_PROJECTS_BY_PROGRAM,
  ...HARDWARE_PROJECTS_BY_PROGRAM,
};

export function getProjectsByDifficulty(difficulty: DomainProject['difficulty']): DomainProject[] {
  return ALL_PROJECTS.filter(p => p.difficulty === difficulty);
}

export function getProjectsByProgram(slug: string): DomainProject[] {
  return PROJECTS_BY_PROGRAM[slug] || [];
}

export function getCapstoneProjects(): DomainProject[] {
  return ALL_PROJECTS.filter(p => p.isCapstone);
}
