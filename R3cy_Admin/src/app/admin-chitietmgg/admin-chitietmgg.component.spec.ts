import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChitietmggComponent } from './admin-chitietmgg.component';

describe('AdminChitietmggComponent', () => {
  let component: AdminChitietmggComponent;
  let fixture: ComponentFixture<AdminChitietmggComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminChitietmggComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminChitietmggComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
