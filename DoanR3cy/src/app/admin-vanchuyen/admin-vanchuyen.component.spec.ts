import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVanchuyenComponent } from './admin-vanchuyen.component';

describe('AdminVanchuyenComponent', () => {
  let component: AdminVanchuyenComponent;
  let fixture: ComponentFixture<AdminVanchuyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminVanchuyenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminVanchuyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
