import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateMggComponent } from './admin-create-mgg.component';

describe('AdminCreateMggComponent', () => {
  let component: AdminCreateMggComponent;
  let fixture: ComponentFixture<AdminCreateMggComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCreateMggComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCreateMggComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
