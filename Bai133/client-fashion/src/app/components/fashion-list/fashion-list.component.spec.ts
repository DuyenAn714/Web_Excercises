import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FashionListComponent } from './fashion-list.component';

describe('FashionListComponent', () => {
  let component: FashionListComponent;
  let fixture: ComponentFixture<FashionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FashionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FashionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
