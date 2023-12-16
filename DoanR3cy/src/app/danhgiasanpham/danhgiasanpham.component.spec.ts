import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhgiasanphamComponent } from './danhgiasanpham.component';

describe('DanhgiasanphamComponent', () => {
  let component: DanhgiasanphamComponent;
  let fixture: ComponentFixture<DanhgiasanphamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DanhgiasanphamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DanhgiasanphamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
