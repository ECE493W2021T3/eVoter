import { Component, Input } from '@angular/core';
import { CHART_COLOR_SCHEME } from 'src/app/helpers/common.const';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {

  @Input('choices') choices: { name: string, value: number }[];
  @Input('question') question: string;
  @Input('size') size: number[];

  colorScheme = CHART_COLOR_SCHEME;
}
