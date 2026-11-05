import {Component} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';
import {NgOptimizedImage} from '@angular/common';
import {ChampionSkinsBaseComponent} from '../champion-skin-base/champion-skin-base.component';

@Component({
  selector: 'app-champion-skins-small-screen',
  imports: [
    MatTooltip,
    NgOptimizedImage
  ],
  templateUrl: './champion-skins-small-screen.component.html',
  styleUrl: './champion-skins-small-screen.component.css'
})
export class ChampionSkinsSmallScreenComponent extends ChampionSkinsBaseComponent {

}
