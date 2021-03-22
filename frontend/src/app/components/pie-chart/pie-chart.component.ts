import { Component, Input  } from '@angular/core';
import { CHART_COLOR_SCHEME } from 'src/app/helpers/common.const';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {
  @Input('choices') choices: { name: string, value: number }[];
  @Input('question') question: string;
  @Input('size') size: number[];

  colorScheme = CHART_COLOR_SCHEME;
}
