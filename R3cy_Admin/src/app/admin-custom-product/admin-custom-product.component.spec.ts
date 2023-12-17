import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomProductComponent } from './admin-custom-product.component';

describe('AdminCustomProductComponent', () => {
  let component: AdminCustomProductComponent;
  let fixture: ComponentFixture<AdminCustomProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCustomProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCustomProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
