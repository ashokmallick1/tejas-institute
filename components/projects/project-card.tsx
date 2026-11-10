import React from 'react';
import type { DomainProject } from '@/lib/data/projects-index';
import { CheckCircle2, Clock, MapPin, Building, Briefcase } from 'lucide-react';

interface ProjectCardProps {
  project: DomainProject;
  expanded?: boolean;
}

const difficultyColors = {
  Foundation: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  Intermediate: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  Advanced: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
  Expert: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
};

export function ProjectCard({ project, expanded = false }: ProjectCardProps) {
  const domain = project.tags && project.tags.length > 0 ? project.tags[0] : 'Domain';
  const targetCompanies = project.sampleCompanies || [];

  return (
    <div className={`h-full flex flex-col transition-all duration-300 bg-card rounded-xl border border-border hover:shadow-md ${expanded ? 'shadow-lg border-primary/20' : ''}`}>
      <div className="p-4 sm:p-6 pb-3">
        <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
          <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold">{domain}</span>
          <div className="flex gap-2">
            {project.isCapstone && (
              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                Capstone
              </span>
            )}
            <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${difficultyColors[project.difficulty] || ''}`}>
              {project.difficulty}
            </span>
          </div>
        </div>
        <h3 className="text-lg sm:text-xl leading-tight mb-2 font-semibold tracking-tight">{project.title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground italic line-clamp-2">{project.context}</p>
      </div>
      
      <div className="p-4 sm:p-6 pt-0 flex-grow flex flex-col gap-4 text-xs sm:text-sm">
        <div className="space-y-1">
          <p className="font-semibold text-foreground flex items-center gap-2">
            Problem Statement
          </p>
          <p className={expanded ? '' : 'line-clamp-2'}>{project.problemStatement}</p>
        </div>
        
        <div className="space-y-2">
          <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span key={tech} className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold font-medium bg-secondary/50">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {expanded && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Deliverables ({project.deliverables.length})</p>
              <ul className="space-y-1.5">
                {project.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {!expanded && (
           <div className="pt-2 border-t flex flex-col gap-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                 <CheckCircle2 className="w-3.5 h-3.5" /> {project.deliverables.length} Deliverables
              </div>
              <div className="flex items-center gap-1">
                 <Briefcase className="w-3.5 h-3.5" /> {project.hiringRoles.slice(0, 2).join(', ')}{project.hiringRoles.length > 2 ? ', ...' : ''}
              </div>
           </div>
        )}

      </div>
      
      {expanded && (
          <div className="p-4 sm:p-6 pt-0 pb-4 flex flex-col gap-3 bg-muted/30 border-t mt-4 rounded-b-xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4 text-xs sm:text-sm">
                <div className="space-y-2">
                   <p className="font-semibold flex items-center gap-1.5"><Briefcase className="w-4 h-4"/> Target Roles</p>
                   <div className="flex flex-wrap gap-1">
                      {project.hiringRoles.map(role => (
                          <span key={role} className="text-xs border rounded px-2 py-0.5 bg-background">{role}</span>
                      ))}
                   </div>
                </div>
                <div className="space-y-2">
                   <p className="font-semibold flex items-center gap-1.5"><Building className="w-4 h-4"/> Target Companies</p>
                   <div className="flex flex-wrap gap-1">
                      {targetCompanies.map(company => (
                          <span key={company} className="text-xs border rounded px-2 py-0.5 bg-background">{company}</span>
                      ))}
                   </div>
                </div>
             </div>
          </div>
      )}
      
      {!expanded && (
          <div className="p-4 sm:p-6 pt-0 flex justify-between items-center text-xs text-muted-foreground border-t mt-auto px-4 sm:px-6 py-3 bg-muted/20">
             <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {project.estimatedWeeks} weeks
             </div>
             {project.isCapstone && (
                <span className="font-medium text-primary hover:underline cursor-pointer">
                   Apply Now &rarr;
                </span>
             )}
          </div>
      )}
    </div>
  );
}
