import {Component, computed, HostListener, Input, signal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ChampionSkin} from '../../../../models/backend/champions/ChampionSkin';
import {MatTooltip} from '@angular/material/tooltip';
import {ChampionFetchingService} from '../../../../services/backend/champions/champion-fetching.service';
import {ChampionSkinsLargeScreenComponent} from '../champion-skins-large-screen/champion-skins-large-screen.component';
import {ChampionSkinsSmallScreenComponent} from '../champion-skins-small-screen/champion-skins-small-screen.component';

@Component({
    selector: 'app-champion-skins',
  imports: [ChampionSkinsLargeScreenComponent, ChampionSkinsSmallScreenComponent],
    templateUrl: './champion-skins.component.html',
    styleUrl: './champion-skins.component.css'
})
export class ChampionSkinsComponent {
  @Input() skins: ChampionSkin[] = [];
  @Input() champion = '';

  width = signal(window.innerWidth);
  isLargeScreen = computed(() => this.width() >= 800);

  @HostListener('window:resize')
  onResize() {
    this.width.set(window.innerWidth);
  }
}
