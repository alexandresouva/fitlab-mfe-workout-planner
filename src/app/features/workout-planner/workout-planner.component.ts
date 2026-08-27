import { Component, computed } from '@angular/core';
import { useMfeSignal } from '@fitlab/tooling/angular';
import { SHELL_EVENTS } from '@fitlab/tooling';

@Component({
  selector: 'app-workout-planner',
  standalone: true,
  imports: [],
  templateUrl: './workout-planner.component.html',
  styleUrls: ['./workout-planner.component.scss']
})
export class WorkoutPlannerComponent {
  private readonly routeData = useMfeSignal(SHELL_EVENTS.ROUTE_CHANGED);

  readonly workoutId = computed(() => this.routeData()?.params?.['id'] || '');
}
