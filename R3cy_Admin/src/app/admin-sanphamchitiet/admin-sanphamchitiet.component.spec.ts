import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSanphamchitietComponent } from './admin-sanphamchitiet.component';

describe('AdminSanphamchitietComponent', () => {
  let component: AdminSanphamchitietComponent;
  let fixture: ComponentFixture<AdminSanphamchitietComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSanphamchitietComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSanphamchitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
