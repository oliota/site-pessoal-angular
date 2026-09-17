import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ContentService } from '../../core/services/content.service';
import { HomeScreenAppService } from '../../core/services/home-screen-app.service';
import { Project } from '../../core/models/profile.models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatChipsModule],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];

  constructor(
    private readonly content: ContentService,
    private readonly router: Router,
    private readonly homeScreen: HomeScreenAppService
  ) {}

  ngOnInit(): void {
    this.content.getProjects().subscribe(projects => this.projects = projects);
  }

  open(project: Project): void {
    if (!project.link) return;
    if (project.link.type === 'route') {
      void this.router.navigateByUrl(project.link.url);
      return;
    }
    if (project.link.target === 'new') {
      window.open(project.link.url, '_blank', 'noopener,noreferrer');
      return;
    }
    window.location.href = project.link.url;
  }

  install(project: Project): void {
    if (project.homeScreenApp?.enabled) void this.homeScreen.install(project.homeScreenApp);
  }
}
