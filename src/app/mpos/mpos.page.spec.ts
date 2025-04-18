import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MposPage } from './mpos.page';

describe('MposPage', () => {
  let component: MposPage;
  let fixture: ComponentFixture<MposPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
