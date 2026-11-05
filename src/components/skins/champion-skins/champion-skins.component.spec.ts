import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionSkinsComponent } from './champion-skins.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {ChampionSkin} from '../../../../models/backend/champions/ChampionSkin';
import {ChampionFetchingService} from '../../../../services/backend/champions/champion-fetching.service';

describe('ChampionSkinsComponent', () => {
  let component: ChampionSkinsComponent;
  let fixture: ComponentFixture<ChampionSkinsComponent>;
  const skin: ChampionSkin =  {
    id: "117000",
    num: 0,
    name: "default",
    chromas: false,
    skinURI: new URL("https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lulu_0.jpg"),
    owned: false
  };

  const skin2: ChampionSkin = {
    id: '117001',
    num: 1,
    name: 'Lulu Dolceamara',
    chromas: false,
    skinURI: new URL('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lulu_1.jpg'),
    owned: false
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionSkinsComponent, HttpClientTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionSkinsComponent);
    component = fixture.componentInstance;
    component.skins = [skin, skin2];
    fixture.detectChanges();
  });

  it('should create', () => {
    let img: HTMLElement = fixture.nativeElement.querySelector('img');
    expect(component).toBeDefined();
    // @ts-ignore
    expect(img.getAttribute('src')).toEqual(skin.skinURI.href)
  });

  it('should increment', () => {
    let img: HTMLElement = fixture.nativeElement.querySelector('img');
    component.goToNextSkin();
    fixture.detectChanges();
    expect(component.activeSkin).toEqual(1);
    expect(img.getAttribute('src')).toEqual(skin2.skinURI.href)
  });

  it('should decrement', () => {
    let img: HTMLElement = fixture.nativeElement.querySelector('img');
    component.gotToPrevSkin()
    expect(component.activeSkin).toEqual(0);
    // @ts-ignore
    expect(img.getAttribute('src')).toEqual(skin.skinURI.href)
  });
});
