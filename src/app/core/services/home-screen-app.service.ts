import { Injectable } from '@angular/core';
import { HomeScreenApp } from '../models/profile.models';
@Injectable({providedIn:'root'})
export class HomeScreenAppService{
 install(app:HomeScreenApp):void{
  const url=new URL('/instalar',window.location.origin);
  url.searchParams.set('name',app.name);
  url.searchParams.set('shortName',app.shortName);
  url.searchParams.set('startUrl',app.startUrl);
  if(app.icon)url.searchParams.set('icon',app.icon);
  window.location.href=url.toString();
 }
}
