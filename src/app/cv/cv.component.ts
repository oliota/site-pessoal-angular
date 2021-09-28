import { Component, OnInit } from '@angular/core';
import {CvService} from '../cv.service'
import { Router } from '@angular/router';
import {Benner, Empresa} from '../cv';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md'

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit {

  cargos_benner: Array<Benner> = [];
  carreira_profisional: Array<Empresa> = [];
  formacao: Array<Empresa> = [];

  constructor(
    private cvService:CvService,
    private router: Router
    ) { }

    ngOnInit() {
      this.reloadData();
    }

    reloadData() {
      this.cargos_benner = this.cvService.getCargosBenner();
      this.carreira_profisional = this.cvService.getCarreiraProfissional();
      this.formacao = this.cvService.getFormacao();
    }


}
