// create-order.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { APIResponseModel, CartData, OrderModel } from '../../model/Product';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
})
export class CreateOrderComponent implements OnInit {
  masterService = inject(MasterService);
  cartData: CartData[] = [];
  totalAmount: number = 0;
  orderObj: OrderModel = new OrderModel();

  ngOnInit(): void {
    this.getCartItems();
  }
  getCartItems() {
    this.masterService
      .getCartProductsByCustomerId(this.masterService.loggedUserData.custId)
      .subscribe((res: APIResponseModel) => {
        this.cartData = res.data;
        this.cartData.forEach((element) => {
          this.totalAmount = this.totalAmount + element.productPrice;
        });
      });
  }
  placeOrder() {
    debugger;
    this.orderObj.CustId = this.masterService.loggedUserData.custId;
    this.orderObj.TotalInvoiceAmount = this.totalAmount;
    this.masterService
      .onPlaceOrder(this.orderObj)
      .subscribe((res: APIResponseModel) => {
        if (res.result) {
          alert('Order Place Successfully');
          this.getCartItems();
          this.orderObj = new OrderModel();
        } else {
          alert(res.message);
        }
      });
  }
}
