import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrestamoList } from './prestamo-list';

describe('PrestamoList', () => {
  let component: PrestamoList;
  let fixture: ComponentFixture<PrestamoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoList],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestamoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
