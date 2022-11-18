import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dicas',
  templateUrl: './dicas.component.html',
  styleUrls: ['./dicas.component.css']
})
export class DicasComponent implements OnInit {

  exemplo:string=""
  constructor() { }

  ngOnInit(): void {
 
    this.exemplo=String(`
    {
       "Primeiro snnipet": {
       	"scope": "html",
       	"prefix": "oliota.div",
       	"body": [
       		"<div>teste</div>"
       	],
       	"description": "Descrição longa do snnipet"
       }
    }
    `)
  }

}
