import { Component, OnInit } from '@angular/core';
import {CvService} from '../cv.service'
import { Router } from '@angular/router';
import {Benner, Empresa} from '../cv';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md'
import { ClassConsole } from '../easterEggs/ClassConsole';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit {

  cargos_benner: Array<Benner> = [];
  carreira_profisional: Array<Empresa> = [];
  formacao: Array<Empresa> = [];

  mobile!:boolean;
  constructor(
    private cvService:CvService,
    private router: Router
    ) { }

    ngOnInit() {
      this.reloadData();
      this.mobile=window.screen.width <= 700
    }

    reloadData() {
      this.cargos_benner = this.cvService.getCargosBenner();
      this.carreira_profisional = this.cvService.getCarreiraProfissional();
      this.formacao = this.cvService.getFormacao();
    }


}
