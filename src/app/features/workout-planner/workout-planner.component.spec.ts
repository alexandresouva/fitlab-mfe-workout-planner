import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutPlannerComponent } from './workout-planner.component';

describe('WorkoutPlannerComponent', () => {
  let component: WorkoutPlannerComponent;
  let fixture: ComponentFixture<WorkoutPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutPlannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
