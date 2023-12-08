import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrangtaikhoanComponent } from './trangtaikhoan.component';

describe('TrangtaikhoanComponent', () => {
  let component: TrangtaikhoanComponent;
  let fixture: ComponentFixture<TrangtaikhoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrangtaikhoanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrangtaikhoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
