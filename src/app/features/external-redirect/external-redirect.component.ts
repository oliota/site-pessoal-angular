import { Component, OnInit } from '@angular/core';
@Component({standalone:true,template:''})
export class ExternalRedirectComponent implements OnInit{
 ngOnInit():void{window.location.replace('https://heroku-frontend-nodejs-8bbe5ba4674a.herokuapp.com/elianeOrganizada')}
}
