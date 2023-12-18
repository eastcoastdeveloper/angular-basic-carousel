import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataInterface } from './data.interface';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private unsubscribe$ = new Subject<boolean>();
  result: DataInterface[] = [];
  currentIndex: number = 0;
  productInfo: boolean = false;
  loaded: boolean = false;

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this._http
      .get<DataInterface[]>(`./assets/data.json`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        this.result = val;
        this.getSliderImage(this.currentIndex);
      });
  }

  changeShowcase(i: number) {
    this.currentIndex = i;
    this.result[this.currentIndex].url;
    this.resetValues();
    this.result[i].status = true;
  }

  getSliderImage(index: number) {
    this.loaded = true;
    return this.result[index].url;
  }

  nextBook() {
    this.getCurrentIndex();
    this.resetValues();
    this.currentIndex++;
    this.currentIndex > this.result.length - 1 ? (this.currentIndex = 0) : '';
    this.result[this.currentIndex].status = true;
  }

  prevBook() {
    this.getCurrentIndex();
    this.resetValues();
    this.currentIndex > 0
      ? this.currentIndex--
      : (this.currentIndex = this.result.length - 1);
    this.result[this.currentIndex].status = true;
  }

  getCurrentIndex() {
    for (var i = 0; i < this.result.length; i++) {
      if (this.result[i].status) {
        this.currentIndex = i;
      }
    }
    this.productInfo = false;
  }

  resetValues() {
    for (var index = 0; index < this.result.length; index++) {
      this.result[index].status = false;
    }
    this.productInfo = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
