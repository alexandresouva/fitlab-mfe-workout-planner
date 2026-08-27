import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutPlannerComponent } from './workout-planner.component';
import { publishMfeEvent, SHELL_EVENTS } from '@fitlab/tooling';
import { mockMfeContext, clearMfeContext } from '@fitlab/tooling/testing';

describe('WorkoutPlannerComponent', () => {
  let component: WorkoutPlannerComponent;
  let fixture: ComponentFixture<WorkoutPlannerComponent>;

  beforeEach(async () => {
    mockMfeContext();
    await TestBed.configureTestingModule({
      imports: [WorkoutPlannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    clearMfeContext();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display editing mode when a workout ID is present in route events', () => {
    publishMfeEvent(SHELL_EVENTS.ROUTE_CHANGED, {
      path: '/workouts/edit/99',
      params: { id: '99' },
      queryParams: {}
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.edit-mode')?.textContent).toContain(
      'Editando Treino ID: 99'
    );
  });
});
