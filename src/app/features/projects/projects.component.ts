import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { HomeScreenAppService } from '../../core/services/home-screen-app.service';
import { Project } from '../../core/models/profile.models';
@Component({standalone:true,imports:[AsyncPipe,RouterLink],templateUrl:'./projects.component.html'})
export class ProjectsComponent{
 readonly content=inject(ContentService);
 private readonly homeScreen=inject(HomeScreenAppService);
 install(item:Project):void{if(item.homeScreenApp?.enabled)this.homeScreen.install(item.homeScreenApp)}
}
