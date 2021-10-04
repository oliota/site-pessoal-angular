import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DicasComponent } from './dicas.component';

describe('DicasComponent', () => {
  let component: DicasComponent;
  let fixture: ComponentFixture<DicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DicasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
