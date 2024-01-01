import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateSpComponent } from './admin-create-sp.component';

describe('AdminCreateSpComponent', () => {
  let component: AdminCreateSpComponent;
  let fixture: ComponentFixture<AdminCreateSpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCreateSpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCreateSpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
