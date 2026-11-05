import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionSkinsLargeScreenComponent } from './champion-skins-large-screen.component';

describe('ChampionSkinsLargeScreenComponent', () => {
  let component: ChampionSkinsLargeScreenComponent;
  let fixture: ComponentFixture<ChampionSkinsLargeScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionSkinsLargeScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionSkinsLargeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
