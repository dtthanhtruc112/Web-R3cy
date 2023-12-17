import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMagiamgiaComponent } from './admin-magiamgia.component';

describe('AdminMagiamgiaComponent', () => {
  let component: AdminMagiamgiaComponent;
  let fixture: ComponentFixture<AdminMagiamgiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMagiamgiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMagiamgiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
