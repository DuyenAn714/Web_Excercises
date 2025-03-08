import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FashionFormComponent } from './fashion-form.component';

describe('FashionFormComponent', () => {
  let component: FashionFormComponent;
  let fixture: ComponentFixture<FashionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FashionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FashionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
