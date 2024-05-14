import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVisitesComponent } from './create-visites.component';

describe('CreateVisitesComponent', () => {
  let component: CreateVisitesComponent;
  let fixture: ComponentFixture<CreateVisitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVisitesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVisitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
