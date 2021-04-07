import { Component, Input, OnInit } from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-csv-downloader',
  templateUrl: './csv-downloader.component.html',
  styleUrls: ['./csv-downloader.component.css']
})
export class CsvDownloaderComponent {


  @Input('fileName') fileName: string = "noName";
  @Input('title') title: string = "No Title";
  @Input('responses') responses: { voter: string, answer1: string, answer2:string }[];
  @Input('questions') questions: string[];
  options: any;
  headers: string[];

  downloadCSV() {
    this.headers = ['voter'].concat(this.questions);
    this.options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: this.headers,
      showTitle: true,
      title: this.title,
      useBom: false,
      removeNewLines: true,
    };
    new Angular2Csv(this.responses, this.fileName, this.options);
  }
}
