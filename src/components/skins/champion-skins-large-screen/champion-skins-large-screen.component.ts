import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ChampionSkinsBaseComponent} from '../champion-skin-base/champion-skin-base.component';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-champion-skins-large-screen',
  imports: [
    NgOptimizedImage,
    MatTooltip
  ],
  templateUrl: './champion-skins-large-screen.component.html',
  styleUrl: './champion-skins-large-screen.component.css'
})
export class ChampionSkinsLargeScreenComponent extends ChampionSkinsBaseComponent{

}
