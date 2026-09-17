import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
@Component({standalone:true,imports:[AsyncPipe,RouterLink],templateUrl:'./projects.component.html'})
export class ProjectsComponent{readonly content=inject(ContentService)}
