import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  btnDisabled = false;
  currentAddress: any;

  constructor(private data: DataService, private rest: RestApiService) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://localhost:3030/api/accounts/address'
      );

      if (JSON.stringify(data[address]) === '{}' && this.data.message === '') {
        this.data.warning('You have not entered your shipping address. Please enter your shipping address')
      }

      this.currentAddress = data['address'];
    }
    catch (error) {
      this.data.error(error['message']);
    }
  }
}
