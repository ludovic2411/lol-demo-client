import {inject, Injectable} from '@angular/core';
import { Component } from '@angular/core';
import {Champion} from '../../models/Champion';
import {Position} from '../../models/Position';
import {ChampionType, findChampionTypeByDescription} from '../../models/ChampionType';
import {FetchingServiceService} from '../fetching-service.service';
import {LanguageService} from '../languages/language.service';
import {JwtAuthService} from '../auth/jwt-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private languageService: LanguageService;
  private authService: JwtAuthService;

  constructor(languageService:LanguageService, authService: JwtAuthService) {
    this.languageService = languageService;
    this.authService = authService;
    if (!sessionStorage.getItem('languageOptions')) {
      this.languageService.storeLanguage();
    }
  }

  private BEGINNER_CHAMPS: Champion[] = [
    new Champion('Malphite',ChampionType.TANK, [Position.TOP,Position.MID]),
    new Champion('Rengar',ChampionType.JUNGLER, [Position.JUNGLE]),
    new Champion('Leona',ChampionType.SUPPORT, [Position.BOTTOM]),
    new Champion('Jinx',ChampionType.ADC, [Position.BOTTOM]),
    new Champion('Tryndamer', ChampionType.BRUISER, [Position.TOP,Position.JUNGLE]),
  ];

  private CHAMPS_OF_THE_WEEK: Champion [] = [
    new Champion('Maokai',ChampionType.TANK, [Position.JUNGLE,Position.TOP,Position.BOTTOM]),
    new Champion('Kha Zhix',ChampionType.JUNGLER, [Position.JUNGLE]),
    new Champion('Leona',ChampionType.SUPPORT, [Position.BOTTOM]),
    new Champion('Ashe',ChampionType.ADC, [Position.BOTTOM]),
    new Champion('Riven', ChampionType.BRUISER, [Position.TOP,Position.JUNGLE])
  ];

  logout(): void {
    this.authService.logout();
  }

  findChampions(champions: Champion[],searchOptions : Champion) : Champion[] {
    if(!searchOptions) return champions;
    if(searchOptions.name.trim().length > 0) champions = this.filterChampionsByName(champions,searchOptions.name);
    if(searchOptions?.type?.trim().length > 0) champions = this.filterChampionsByType(champions,searchOptions.type.trim());
    if(searchOptions?.positions?.length > 0) champions = this.filterChampionsByPosition(champions,searchOptions.positions);

    return champions;
  }

  filterChampionsByName(champions: Champion[], name : String): Champion[] {
    if(name.length === 0) return champions;
   return champions.filter(champion => champion.name.toLowerCase() === name.toLowerCase());
  }

  filterChampionsByPosition(champions: Champion[], positions: Position[]): Champion[] {
    return champions.filter(champion =>
      champion.positions.some(position => positions.includes(position))
    );
  }

  filterChampionsByType(champions: Champion[], typeDescription: string) : Champion[] {
    return champions.filter(champion => champion.type === findChampionTypeByDescription(typeDescription));
  }

  toggleBeginner(isBeginner:boolean): boolean {
    return !isBeginner
  }

  loadChampions(isBeginner: boolean): Champion[] {
    return isBeginner ? this.BEGINNER_CHAMPS : this.CHAMPS_OF_THE_WEEK;
  }
}
