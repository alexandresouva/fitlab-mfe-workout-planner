export type WorkoutSet = {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
};

export type Exercise = {
  id: string;
  name: string;
  restTimeSeconds: number;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
};
