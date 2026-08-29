import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';

import { of } from 'rxjs';

import { publishMfeEvent, SHELL_EVENTS } from '@fitlab/tooling';
import { mockMfeContext, clearMfeContext } from '@fitlab/tooling/testing';

import { WorkoutPlannerComponent } from './workout-planner.component';

describe('WorkoutPlannerComponent', () => {
  let component: WorkoutPlannerComponent;
  let fixture: ComponentFixture<WorkoutPlannerComponent>;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockMfeContext();

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockActivatedRoute = {
      paramMap: of(convertToParamMap({}))
    };

    await TestBed.configureTestingModule({
      imports: [WorkoutPlannerComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
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

  it('should display workouts grid when activeWorkout is null', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.workouts-grid')).toBeTruthy();
    expect(compiled.querySelectorAll('fitlab-card').length).toBe(3);
  });

  it('should select workout and navigate to workouts/:id when selected', () => {
    component.onSelectWorkout('2');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/workouts', '2']);
  });

  it('should load active workout when ROUTE_CHANGED event publishes valid ID', () => {
    publishMfeEvent(SHELL_EVENTS.ROUTE_CHANGED, {
      path: '/workouts/1',
      params: { id: '1' },
      queryParams: {}
    });
    fixture.detectChanges();

    expect(component.store.activeWorkout()?.id).toBe('1');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.active-header')).toBeTruthy();
  });

  it('should go back to workouts list when onGoBack is called', () => {
    component.onGoBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/workouts']);
  });

  it('should publish set-completed event when a set is toggled to completed', () => {
    spyOn(window, 'dispatchEvent').and.callThrough();

    // Select workout 1
    publishMfeEvent(SHELL_EVENTS.ROUTE_CHANGED, {
      path: '/workouts/1',
      params: { id: '1' },
      queryParams: {}
    });
    fixture.detectChanges();

    const activeWorkout = component.store.activeWorkout()!;
    const exercise = activeWorkout.exercises[0];
    const targetSet = exercise.sets[0];

    // Toggle set to completed
    component.onToggleSet(exercise.id, targetSet);
    fixture.detectChanges();

    expect(window.dispatchEvent).toHaveBeenCalled();
    const lastCall = (window.dispatchEvent as jasmine.Spy).calls.mostRecent()
      .args[0] as CustomEvent;
    expect(lastCall.type).toBe('mfe:workout:set-completed');
    expect(lastCall.detail).toEqual({ restTimeSeconds: 60 });
  });

  it('should add a new exercise and then clear form fields', () => {
    // Select workout 1
    publishMfeEvent(SHELL_EVENTS.ROUTE_CHANGED, {
      path: '/workouts/1',
      params: { id: '1' },
      queryParams: {}
    });
    fixture.detectChanges();

    const initialExerciseCount =
      component.store.activeWorkout()!.exercises.length;

    // Fill form
    component.newExerciseName.set('Rosca Concentrada');
    component.newExerciseSets.set(3);
    component.newExerciseReps.set(12);
    component.newExerciseWeight.set(12);
    component.newExerciseRest.set(45);

    // Add exercise
    component.onAddExercise();
    fixture.detectChanges();

    const activeWorkout = component.store.activeWorkout()!;
    expect(activeWorkout.exercises.length).toBe(initialExerciseCount + 1);

    // Assert reset
    expect(component.newExerciseName()).toBe('');
    expect(component.newExerciseSets()).toBe(4);
    expect(component.newExerciseReps()).toBe(10);
    expect(component.newExerciseWeight()).toBe(20);
    expect(component.newExerciseRest()).toBe(60);
  });

  it('should remove an exercise from the current active workout', () => {
    // Select workout 1
    publishMfeEvent(SHELL_EVENTS.ROUTE_CHANGED, {
      path: '/workouts/1',
      params: { id: '1' },
      queryParams: {}
    });
    fixture.detectChanges();

    const activeWorkoutBefore = component.store.activeWorkout()!;
    const initialExerciseCount = activeWorkoutBefore.exercises.length;
    const targetExerciseId = activeWorkoutBefore.exercises[0].id;

    // Remove exercise
    component.onRemoveExercise(targetExerciseId);
    fixture.detectChanges();

    const activeWorkoutAfter = component.store.activeWorkout()!;
    expect(activeWorkoutAfter.exercises.length).toBe(initialExerciseCount - 1);
  });

  it('should not add exercise if name is empty', () => {
    // Select workout 1
    publishMfeEvent(SHELL_EVENTS.ROUTE_CHANGED, {
      path: '/workouts/1',
      params: { id: '1' },
      queryParams: {}
    });
    fixture.detectChanges();

    const initialExerciseCount =
      component.store.activeWorkout()!.exercises.length;

    // Empty name
    component.newExerciseName.set('   ');
    component.onAddExercise();
    fixture.detectChanges();

    const activeWorkout = component.store.activeWorkout()!;
    expect(activeWorkout.exercises.length).toBe(initialExerciseCount);
  });

  it('should return early in store addExercise if name is empty', () => {
    const initialWorkouts = component.store.workouts();
    component.store.addExercise('', 4, 10, 20, 60);
    expect(component.store.workouts()).toEqual(initialWorkouts);
  });

  it('should fallback to ActivatedRoute params if routeData is undefined (standalone mode)', () => {
    // Clear MFE Context to simulate standalone mode
    clearMfeContext();

    const standaloneRoute = {
      paramMap: of(convertToParamMap({ id: '3' }))
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [WorkoutPlannerComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: standaloneRoute }
      ]
    }).compileComponents();

    const standaloneFixture = TestBed.createComponent(WorkoutPlannerComponent);
    const standaloneComponent = standaloneFixture.componentInstance;
    standaloneFixture.detectChanges();

    expect(standaloneComponent.store.activeWorkout()?.id).toBe('3');
  });
});
