import { Injectable } from '@angular/core';
import { HomeScreenApp } from '../models/profile.models';

@Injectable({ providedIn: 'root' })
export class HomeScreenAppService {
  private deferredPrompt: any;

  constructor() {
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      this.deferredPrompt = event;
    });
  }

  async install(app: HomeScreenApp): Promise<void> {
    this.applyManifest(app);

    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      return;
    }

    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      alert('No Safari, toque em Compartilhar e depois em “Adicionar à Tela de Início”.');
      return;
    }

    alert('Abra o menu do navegador e escolha “Adicionar à tela inicial” ou “Instalar app”.');
  }

  applyManifest(app: HomeScreenApp): void {
    const manifest = {
      name: app.name,
      short_name: app.shortName,
      description: app.description ?? app.name,
      start_url: app.startUrl,
      scope: app.scope ?? '/',
      display: 'standalone',
      theme_color: app.themeColor ?? '#6750a4',
      background_color: app.backgroundColor ?? '#fffbfe',
      icons: [
        {
          src: app.icon ?? '/icons/app-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: app.icon ?? '/icons/app-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    };
    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
    const href = URL.createObjectURL(blob);
    let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }
    link.href = href;
  }
}
