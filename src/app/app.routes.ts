import { Routes } from '@angular/router';
export const routes: Routes=[
 {path:'',loadComponent:()=>import('./features/home/home.component').then(m=>m.HomeComponent)},
 {path:'e',loadComponent:()=>import('./features/external-redirect/external-redirect.component').then(m=>m.ExternalRedirectComponent)},
 {path:'experiencia',loadComponent:()=>import('./features/experience/experience.component').then(m=>m.ExperienceComponent)},
 {path:'projetos',loadComponent:()=>import('./features/projects/projects.component').then(m=>m.ProjectsComponent)},
 {path:'aulas',loadComponent:()=>import('./features/teaching/teaching.component').then(m=>m.TeachingComponent)},
 {path:'skills',loadComponent:()=>import('./features/skills/skills.component').then(m=>m.SkillsComponent)},
 {path:'sobre',loadComponent:()=>import('./features/about/about.component').then(m=>m.AboutComponent)},
 {path:'**',redirectTo:''}
];
