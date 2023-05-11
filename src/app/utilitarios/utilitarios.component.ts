import { Component, OnInit } from '@angular/core';
import { OliotaUtils } from '../utils';

@Component({
  selector: 'app-utilitarios',
  templateUrl: './utilitarios.component.html',
  styleUrls: ['./utilitarios.component.css']
})
export class UtilitariosComponent implements OnInit {

  oliotaUtils!:OliotaUtils
  constructor(oliota:OliotaUtils) { 
    this.oliotaUtils=oliota
  }

  ngOnInit(): void {
  }

}
