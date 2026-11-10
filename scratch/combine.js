const fs = require('fs');

const p1 = fs.readFileSync('scratch/projects-part1.ts', 'utf8').replace(/import \{ DomainProject \} from '\.\/projects';/, '');
const p2 = fs.readFileSync('scratch/projects-part2.ts', 'utf8').replace(/import \{ DomainProject \} from '\.\/projects';/, '');
const p3 = fs.readFileSync('scratch/projects-part3.ts', 'utf8').replace(/import \{ DomainProject \} from '\.\/projects';/, '');
const p4 = fs.readFileSync('scratch/projects-part4.ts', 'utf8').replace(/import \{ DomainProject \} from '\.\/projects';/, '');

const combined = `import { DomainProject } from './projects';\n` + p1 + p2 + p3 + p4 + `\nexport const HARDWARE_PROJECTS: DomainProject[] = [...vlsiProjects, ...evAndRoboticsProjects, ...gpuAndGisProjects, ...healthAndFdeProjects];
export const HARDWARE_PROJECTS_BY_PROGRAM: Record<string, DomainProject[]> = {};
HARDWARE_PROJECTS.forEach(p => {
  if (!HARDWARE_PROJECTS_BY_PROGRAM[p.programSlug]) {
    HARDWARE_PROJECTS_BY_PROGRAM[p.programSlug] = [];
  }
  HARDWARE_PROJECTS_BY_PROGRAM[p.programSlug].push(p);
});
`;

fs.writeFileSync('lib/data/projects-hardware.ts', combined);
