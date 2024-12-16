import { Component, OnInit, inject } from '@angular/core';
import { MasterService, OrderItem } from '../../service/master.service';
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
  router = inject(Router);

  cartData: CartData[] = [];
  totalAmount: number = 0;
  orderObj: OrderModel & { OrderItems?: OrderItem[] } = new OrderModel();

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems() {
    this.masterService
      .getCartProductsByCustomerId(this.masterService.loggedUserData.custId)
      .subscribe((res: APIResponseModel) => {
        this.cartData = res.data;
        this.totalAmount = this.cartData.reduce(
          (total, item) => total + item.productPrice,
          0
        );

        // Prepare OrderItems for backend
        this.orderObj.OrderItems = this.cartData.map((item) => ({
          ProductId: item.productId,
          Quantity: 1, // Assuming quantity is 1, adjust if needed
          Price: item.productPrice,
          productName: item.productName,
          productShortName: item.productShortName,
          addedDate: item.addedDate,
          productImageUrl: item.productImageUrl,
          categoryName: item.categoryName,
        }));
      });
  }

  placeOrder() {
    this.orderObj.CustId = this.masterService.loggedUserData.custId;
    this.orderObj.TotalInvoiceAmount = this.totalAmount;
    this.orderObj.OrderItems = this.cartData.map((item) => ({
      ProductId: item.productId,
      Quantity: 1,
      Price: item.productPrice,
      productName: item.productName,
      productShortName: item.productShortName,
      addedDate: item.addedDate,
      productImageUrl: item.productImageUrl,
      categoryName: item.categoryName,
    }));

    this.masterService.onPlaceOrder(this.orderObj).subscribe({
      next: (res: APIResponseModel) => {
        if (res.result) {
          alert('Order Placed Successfully');
          // Optionally navigate or clear cart
          this.router.navigate(['/orders']);
        } else {
          alert(res.message);
        }
      },
      error: (err) => {
        console.error('Order placement error', err);
        alert('Failed to place order. Please try again.');
      },
    });
  }
}
