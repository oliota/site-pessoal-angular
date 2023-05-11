import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Injectable({
    providedIn: 'root'
  })
export class OliotaUtils {

  constructor(private router: Router,
    private location: Location){

  }
   
    scrollTo(anchor: string) {
        (document.getElementById(anchor) as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    
      }

      backClicked() {
        let getComponenteSessao = sessionStorage.getItem("componenteAtual");
        if (getComponenteSessao == "inicio") {
          this.router.navigate(["/inicio"]); 
        } else {
          this.location.back();
        }
      }

      isBack() {
        let getComponenteSessao = sessionStorage.getItem("componenteAtual");
        return getComponenteSessao == "inicio" 
        
      }

}