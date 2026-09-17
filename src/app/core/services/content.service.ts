import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { Experience, Profile, Project, SkillGroup, Teaching } from '../models/profile.models';
@Injectable({providedIn:'root'})
export class ContentService {
  private readonly http=inject(HttpClient);
  readonly profile=this.load<Profile>('profile');
  readonly experience=this.load<Experience[]>('experience');
  readonly projects=this.load<Project[]>('projects');
  readonly teaching=this.load<Teaching[]>('teaching');
  readonly skills=this.load<SkillGroup[]>('skills');
  private load<T>(name:string){return this.http.get<T>(`assets/data/${name}.json`).pipe(shareReplay(1));}
}
