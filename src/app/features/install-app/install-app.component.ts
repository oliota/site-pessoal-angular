import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({standalone:true,template:`<section class="page"><div class="section-head"><div class="eyebrow">ATALHO</div><h2>{{name}}</h2><p class="lead">Adicione esta página à tela inicial do telemóvel. O ícone abrirá diretamente o projeto.</p></div><article class="card"><h3>{{shortName}}</h3><p><strong>Android:</strong> abra o menu do navegador e escolha “Adicionar à tela inicial” ou “Instalar app”.</p><p><strong>iPhone:</strong> no Safari, toque em Compartilhar e depois em “Adicionar à Tela de Início”.</p><p>Depois de adicionar, o atalho abrirá <strong>{{startUrl}}</strong>.</p></article></section>`})
export class InstallAppComponent implements OnInit{
 name='App';shortName='App';startUrl='/';icon='/icons/eliane-512.png';
 constructor(private readonly route:ActivatedRoute){}
 ngOnInit():void{
  const q=this.route.snapshot.queryParamMap;
  this.name=q.get('name')??this.name;
  this.shortName=q.get('shortName')??this.shortName;
  this.startUrl=q.get('startUrl')??this.startUrl;
  this.icon=q.get('icon')??this.icon;
  this.applyManifest();
 }
 private applyManifest():void{
  const manifest={name:this.name,short_name:this.shortName,start_url:this.startUrl,scope:'/',display:'standalone',theme_color:'#6750a4',background_color:'#fffbfe',icons:[{src:this.icon,sizes:'512x512',type:'image/png',purpose:'any maskable'}]};
  const blob=new Blob([JSON.stringify(manifest)],{type:'application/manifest+json'});
  const link=document.createElement('link');link.rel='manifest';link.href=URL.createObjectURL(blob);document.head.appendChild(link);
  let apple=document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
  if(!apple){apple=document.createElement('link');apple.rel='apple-touch-icon';document.head.appendChild(apple)}
  apple.href=this.icon;
  document.title=this.name;
 }
}
