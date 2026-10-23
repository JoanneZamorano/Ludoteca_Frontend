import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrestamoEdit } from './prestamo-edit';

describe('PrestamoEdit', () => {
  let component: PrestamoEdit;
  let fixture: ComponentFixture<PrestamoEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestamoEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
