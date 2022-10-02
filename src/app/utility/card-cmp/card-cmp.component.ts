import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'card-cmp',
  templateUrl: './card-cmp.component.html',
  styleUrls: ['./card-cmp.component.css']
})
export class CardCmpComponent implements OnInit {

  @Input() cardData : any;

  constructor() { }

  ngOnInit() { }

}
