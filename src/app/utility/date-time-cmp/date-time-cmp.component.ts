import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'date-time-cmp',
  templateUrl: './date-time-cmp.component.html',
  styleUrls: ['./date-time-cmp.component.css']
})
export class DateTimeCmpComponent implements OnInit {

  model: any;
  _minRange!: Date;
  _maxRange = new Date();
  dateTime: any;
  @Output() public userSelection: EventEmitter<any> = new EventEmitter()
  @Input() set maxRange(value: Date) {
    console.log(value);
    this._minRange = value;
  }
  get maxRange(): Date {
    return this._minRange;
  }
  constructor() { }

  ngOnInit() { }


  onDateChange($event: any) {
    if ($event && $event != 'null') {
      this.userSelection.emit(new Date($event).toISOString());
    } else {
      this.dateTime = '';
    }
  }

  removeDate() {
    this.dateTime = '';
  }

}
