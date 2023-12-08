import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDonhangComponent } from './admin-donhang.component';

describe('AdminDonhangComponent', () => {
  let component: AdminDonhangComponent;
  let fixture: ComponentFixture<AdminDonhangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDonhangComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDonhangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
