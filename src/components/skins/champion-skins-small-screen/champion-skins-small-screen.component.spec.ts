import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionSkinsSmallScreenComponent } from './champion-skins-small-screen.component';

describe('ChampionSkinsSmallScreenComponent', () => {
  let component: ChampionSkinsSmallScreenComponent;
  let fixture: ComponentFixture<ChampionSkinsSmallScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionSkinsSmallScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionSkinsSmallScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
