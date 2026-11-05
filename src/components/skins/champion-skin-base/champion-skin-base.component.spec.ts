import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionSkinBaseComponent } from './champion-skin-base.component';

describe('ChampionSkinBaseComponent', () => {
  let component: ChampionSkinBaseComponent;
  let fixture: ComponentFixture<ChampionSkinBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionSkinBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionSkinBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
