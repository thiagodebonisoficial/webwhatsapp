import { Component, OnInit, Input } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { switchMap, map, takeWhile } from 'rxjs/operators';

@Component({
	selector: 'app-progress-bar',
	template: `
		<div>
			<progress dir="ltr" max="100" [value]="timer$ | async"></progress>
		</div>
	`,
	styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
	@Input() loading$: Observable<boolean>;
	protected interval = 1000; // 1ms
	protected minutes = 0;
	timer$ = new Observable<number>();

	protected get time(): number {
		return this.minutes * this.interval * 60;
	}

	protected remainingSeconds(time: number, interval: number, t: number): number {
		return time / interval + t;
	}

	constructor() {}

	ngOnInit(): void {
		this.timer$ = this.loading$.pipe(
			switchMap(isLoading => (isLoading ? timer(0, 0) : timer(100, 0))),
			map(t => this.remainingSeconds(this.time, this.interval, t)),
			takeWhile(t => t >= 0 && t <= 100)
		);
	}
}
