import { Component, OnInit } from '@angular/core'; 

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  mobile!: boolean;
  constructor() { }

  ngOnInit(): void {
    this.mobile = window.screen.width <= 700
    let modo_desenvolvedor: any = sessionStorage.getItem("modo_desenvolvedor")
 

    if(!modo_desenvolvedor) {
      sessionStorage.setItem("modo_desenvolvedor", JSON.stringify(false)) 
    }  



  }

}
