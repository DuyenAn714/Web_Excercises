import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FashionDetailComponent } from './fashion-detail.component';

describe('FashionDetailComponent', () => {
  let component: FashionDetailComponent;
  let fixture: ComponentFixture<FashionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FashionDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FashionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
