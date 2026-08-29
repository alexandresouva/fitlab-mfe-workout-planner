import { Injectable, signal, computed } from '@angular/core';

import { Workout, Exercise } from '../domain/workout.model';

const INITIAL_MOCK_WORKOUTS: Workout[] = [
  {
    id: '1',
    name: 'Treino A - Peito & Tríceps',
    description:
      'Foco em força de empurrar, hipertrofia de peitoral e tríceps.',
    exercises: [
      {
        id: 'ex-1-1',
        name: 'Supino Reto (Barra)',
        restTimeSeconds: 60,
        sets: [
          {
            id: 'set-1-1-1',
            setNumber: 1,
            reps: 10,
            weight: 60,
            completed: false
          },
          {
            id: 'set-1-1-2',
            setNumber: 2,
            reps: 10,
            weight: 60,
            completed: false
          },
          {
            id: 'set-1-1-3',
            setNumber: 3,
            reps: 10,
            weight: 60,
            completed: false
          },
          {
            id: 'set-1-1-4',
            setNumber: 4,
            reps: 10,
            weight: 60,
            completed: false
          }
        ]
      },
      {
        id: 'ex-1-2',
        name: 'Supino Inclinado (Halteres)',
        restTimeSeconds: 60,
        sets: [
          {
            id: 'set-1-2-1',
            setNumber: 1,
            reps: 10,
            weight: 24,
            completed: false
          },
          {
            id: 'set-1-2-2',
            setNumber: 2,
            reps: 10,
            weight: 24,
            completed: false
          },
          {
            id: 'set-1-2-3',
            setNumber: 3,
            reps: 10,
            weight: 24,
            completed: false
          },
          {
            id: 'set-1-2-4',
            setNumber: 4,
            reps: 10,
            weight: 24,
            completed: false
          }
        ]
      },
      {
        id: 'ex-1-3',
        name: 'Tríceps Pulley',
        restTimeSeconds: 45,
        sets: [
          {
            id: 'set-1-3-1',
            setNumber: 1,
            reps: 12,
            weight: 25,
            completed: false
          },
          {
            id: 'set-1-3-2',
            setNumber: 2,
            reps: 12,
            weight: 25,
            completed: false
          },
          {
            id: 'set-1-3-3',
            setNumber: 3,
            reps: 12,
            weight: 25,
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Treino B - Costas & Bíceps',
    description: 'Foco em força de puxar, largura de costas e bíceps.',
    exercises: [
      {
        id: 'ex-2-1',
        name: 'Puxada Alta (Cabo)',
        restTimeSeconds: 60,
        sets: [
          {
            id: 'set-2-1-1',
            setNumber: 1,
            reps: 12,
            weight: 50,
            completed: false
          },
          {
            id: 'set-2-1-2',
            setNumber: 2,
            reps: 12,
            weight: 50,
            completed: false
          },
          {
            id: 'set-2-1-3',
            setNumber: 3,
            reps: 12,
            weight: 50,
            completed: false
          },
          {
            id: 'set-2-1-4',
            setNumber: 4,
            reps: 12,
            weight: 50,
            completed: false
          }
        ]
      },
      {
        id: 'ex-2-2',
        name: 'Remada Curvada (Barra)',
        restTimeSeconds: 60,
        sets: [
          {
            id: 'set-2-2-1',
            setNumber: 1,
            reps: 10,
            weight: 40,
            completed: false
          },
          {
            id: 'set-2-2-2',
            setNumber: 2,
            reps: 10,
            weight: 40,
            completed: false
          },
          {
            id: 'set-2-2-3',
            setNumber: 3,
            reps: 10,
            weight: 40,
            completed: false
          },
          {
            id: 'set-2-2-4',
            setNumber: 4,
            reps: 10,
            weight: 40,
            completed: false
          }
        ]
      },
      {
        id: 'ex-2-3',
        name: 'Rosca Direta (W)',
        restTimeSeconds: 45,
        sets: [
          {
            id: 'set-2-3-1',
            setNumber: 1,
            reps: 12,
            weight: 15,
            completed: false
          },
          {
            id: 'set-2-3-2',
            setNumber: 2,
            reps: 12,
            weight: 15,
            completed: false
          },
          {
            id: 'set-2-3-3',
            setNumber: 3,
            reps: 12,
            weight: 15,
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Treino C - Pernas & Ombros',
    description: 'Foco em membros inferiores e hipertrofia de deltoides.',
    exercises: [
      {
        id: 'ex-3-1',
        name: 'Agachamento Livre (Barra)',
        restTimeSeconds: 90,
        sets: [
          {
            id: 'set-3-1-1',
            setNumber: 1,
            reps: 8,
            weight: 80,
            completed: false
          },
          {
            id: 'set-3-1-2',
            setNumber: 2,
            reps: 8,
            weight: 80,
            completed: false
          },
          {
            id: 'set-3-1-3',
            setNumber: 3,
            reps: 8,
            weight: 80,
            completed: false
          },
          {
            id: 'set-3-1-4',
            setNumber: 4,
            reps: 8,
            weight: 80,
            completed: false
          }
        ]
      },
      {
        id: 'ex-3-2',
        name: 'Desenvolvimento (Halteres)',
        restTimeSeconds: 60,
        sets: [
          {
            id: 'set-3-2-1',
            setNumber: 1,
            reps: 10,
            weight: 18,
            completed: false
          },
          {
            id: 'set-3-2-2',
            setNumber: 2,
            reps: 10,
            weight: 18,
            completed: false
          },
          {
            id: 'set-3-2-3',
            setNumber: 3,
            reps: 10,
            weight: 18,
            completed: false
          }
        ]
      },
      {
        id: 'ex-3-3',
        name: 'Elevação Lateral',
        restTimeSeconds: 45,
        sets: [
          {
            id: 'set-3-3-1',
            setNumber: 1,
            reps: 12,
            weight: 10,
            completed: false
          },
          {
            id: 'set-3-3-2',
            setNumber: 2,
            reps: 12,
            weight: 10,
            completed: false
          },
          {
            id: 'set-3-3-3',
            setNumber: 3,
            reps: 12,
            weight: 10,
            completed: false
          }
        ]
      }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class WorkoutStore {
  // State Signals
  private readonly workoutsState = signal<Workout[]>(INITIAL_MOCK_WORKOUTS);
  private readonly activeWorkoutIdState = signal<string | null>(null);

  // Selectors
  readonly workouts = this.workoutsState.asReadonly();
  readonly activeWorkoutId = this.activeWorkoutIdState.asReadonly();

  readonly activeWorkout = computed(() => {
    const id = this.activeWorkoutIdState();
    return this.workoutsState().find((w) => w.id === id) || null;
  });

  readonly workoutProgress = computed(() => {
    const active = this.activeWorkout();
    if (!active || active.exercises.length === 0) {
      return { totalSets: 0, completedSets: 0, percentage: 0 };
    }

    let totalSets = 0;
    let completedSets = 0;

    for (const ex of active.exercises) {
      totalSets += ex.sets.length;
      completedSets += ex.sets.filter((s) => s.completed).length;
    }

    const percentage =
      totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
    return { totalSets, completedSets, percentage };
  });

  // Actions
  selectWorkout(id: string | null): void {
    this.activeWorkoutIdState.set(id);
  }

  toggleSetCompletion(exerciseId: string, setId: string): boolean {
    let completedStatus = false;

    this.workoutsState.update((workouts) =>
      workouts.map((w) => {
        if (w.id !== this.activeWorkoutIdState()) {
          return w;
        }

        return {
          ...w,
          exercises: w.exercises.map((ex) => {
            if (ex.id !== exerciseId) {
              return ex;
            }

            return {
              ...ex,
              sets: ex.sets.map((s) => {
                if (s.id === setId) {
                  completedStatus = !s.completed;
                  return { ...s, completed: completedStatus };
                }
                return s;
              })
            };
          })
        };
      })
    );

    return completedStatus;
  }

  addExercise(
    exerciseName: string,
    setsCount: number,
    reps: number,
    weight: number,
    restTimeSeconds: number
  ): void {
    if (!exerciseName.trim()) return;

    this.workoutsState.update((workouts) =>
      workouts.map((w) => {
        if (w.id !== this.activeWorkoutIdState()) {
          return w;
        }

        const newExercise: Exercise = {
          id: `ex-${Date.now()}`,
          name: exerciseName,
          restTimeSeconds,
          sets: Array.from({ length: setsCount }, (_, index) => ({
            id: `set-${Date.now()}-${index}`,
            setNumber: index + 1,
            reps,
            weight,
            completed: false
          }))
        };

        return {
          ...w,
          exercises: [...w.exercises, newExercise]
        };
      })
    );
  }

  removeExercise(exerciseId: string): void {
    this.workoutsState.update((workouts) =>
      workouts.map((w) => {
        if (w.id !== this.activeWorkoutIdState()) {
          return w;
        }

        return {
          ...w,
          exercises: w.exercises.filter((ex) => ex.id !== exerciseId)
        };
      })
    );
  }
}
