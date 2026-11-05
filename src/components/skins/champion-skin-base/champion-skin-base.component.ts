import { Component } from '@angular/core';

// champion-skins-base.component.ts
import { Directive, inject, Input } from '@angular/core';
import { ChampionSkin } from '../../../../models/backend/champions/ChampionSkin'
import { ChampionFetchingService } from '../../../../services/backend/champions/champion-fetching.service';

@Directive() // requis en Angular pour une classe de base avec @Input / DI
export abstract class ChampionSkinsBaseComponent {
  @Input() skins: ChampionSkin[] = [];
  @Input() champion: string = '';

  activeSkin = 0;
  ownedSkinPlaceholder = 'You own this skin in your collection';
  checkSkinPlaceholder = 'Mark skin as owned';

  protected championFetchingService = inject(ChampionFetchingService);

  goToNextSkin(): void {
    if (this.activeSkin < this.skins.length - 1) this.activeSkin++;
  }

  goToPrevSkin(): void {
    if (this.activeSkin > 0) this.activeSkin--;
  }

  toggleSkinOwned(skin: ChampionSkin): void {
    skin.owned = !skin.owned;
    this.championFetchingService
      .updateOwnedChampionSkin(this.champion, skin.id, skin.owned)
      .subscribe({
        next: () =>
          alert(skin.owned
            ? `Skin: ${skin.name} added to your collection`
            : `Skin: ${skin.name} removed from your collection`),
        error: (err) => console.error(err),
      });
  }

  startX: number = 0;
  startY: number = 0;
  dist: number = 0;
  threshold: number = 70; // distance minimale pour être considéré comme un swipe
  allowedTime: number = 200; // temps maximum pour effectuer le swipe
  elapsedTime: number = 0;
  startTime: number = 0;

  onTouchStart(e: TouchEvent) {
    let touchobj = e.changedTouches[0];
    this.dist = 0;
    this.startX = touchobj.pageX;
    this.startY = touchobj.pageY;
    this.startTime = new Date().getTime(); // temps de début du contact
    e.preventDefault();
  }

  onTouchMove(e: TouchEvent) {
    e.preventDefault(); // empêcher le défilement lors du swipe
  }

  onTouchEnd(e: TouchEvent) {
    let touchobj = e.changedTouches[0];
    this.dist = touchobj.pageX - this.startX; // distance parcourue horizontalement
    this.elapsedTime = new Date().getTime() - this.startTime; // temps écoulé
    // vérifier si le swipe est valide
    //let swiperightBol = (this.elapsedTime <= this.allowedTime && this.dist >= this.threshold && Math.abs(touchobj.pageY - this.startY) <= 100);
    let swiperightBol = (this.elapsedTime <= this.allowedTime && this.dist >= this.threshold && Math.abs(touchobj.pageY - this.startY) <= 100);
    this.handleSwipe(swiperightBol);
    e.preventDefault();
  }

  handleSwipe(isrightswipe: boolean): void {
    console.log(isrightswipe)
    if (isrightswipe) {
      this.goToNextSkin();
    } else {
      this.goToPrevSkin();
    }
  }
}
