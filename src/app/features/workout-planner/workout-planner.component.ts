import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { SHELL_EVENTS, publishMfeEvent } from '@fitlab/tooling';
import { useMfeSignal } from '@fitlab/tooling/angular';

import { WorkoutSet } from '../../core/domain/workout.model';
import { WorkoutStore } from '../../core/store/workout.store';

@Component({
  selector: 'app-workout-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-planner.component.html',
  styleUrls: ['./workout-planner.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkoutPlannerComponent {
  readonly store = inject(WorkoutStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Shell integration route listener
  private readonly routeData = useMfeSignal(SHELL_EVENTS.ROUTE_CHANGED);

  // Form fields for adding new exercise
  readonly newExerciseName = signal('');
  readonly newExerciseSets = signal(4);
  readonly newExerciseReps = signal(10);
  readonly newExerciseWeight = signal(20);
  readonly newExerciseRest = signal(60);

  constructor() {
    // Listen to route changes from Shell
    effect(
      () => {
        const shellRoute = this.routeData();
        if (shellRoute) {
          const workoutId = shellRoute.params?.['id'] || null;
          this.store.selectWorkout(workoutId);
        }
      },
      { allowSignalWrites: true }
    );

    // Standalone fallback listener (ActivatedRoute paramMap)
    this.route.paramMap.subscribe((params) => {
      if (!this.routeData()) {
        const workoutId = params.get('id');
        this.store.selectWorkout(workoutId);
      }
    });
  }

  onSelectWorkout(id: string): void {
    this.router.navigate(['/workouts', id]);
  }

  onGoBack(): void {
    this.router.navigate(['/workouts']);
  }

  onToggleSet(exerciseId: string, set: WorkoutSet): void {
    const completed = this.store.toggleSetCompletion(exerciseId, set.id);

    // Publish integration event to window if set was completed (completed = true)
    if (completed) {
      const exercise = this.store
        .activeWorkout()
        ?.exercises.find((ex) => ex.id === exerciseId);
      const restTime = exercise?.restTimeSeconds ?? 60;

      publishMfeEvent('mfe:workout:set-completed', {
        restTimeSeconds: restTime
      });
    }
  }

  onAddExercise(): void {
    const name = this.newExerciseName();
    if (!name.trim()) return;

    this.store.addExercise(
      name,
      this.newExerciseSets(),
      this.newExerciseReps(),
      this.newExerciseWeight(),
      this.newExerciseRest()
    );

    // Reset Form Fields
    this.newExerciseName.set('');
    this.newExerciseSets.set(4);
    this.newExerciseReps.set(10);
    this.newExerciseWeight.set(20);
    this.newExerciseRest.set(60);
  }

  onRemoveExercise(exerciseId: string): void {
    this.store.removeExercise(exerciseId);
  }
}
