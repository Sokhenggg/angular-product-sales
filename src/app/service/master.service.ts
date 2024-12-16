import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  forkJoin,
  map,
  Observable,
  Subject,
  catchError,
  throwError,
} from 'rxjs';
import {
  APIResponseModel,
  CartModel,
  Customer,
  LoginModel,
  OrderModel,
} from '../model/Product';
import { Constant } from '../constant/constant';
import { environment } from '../../environment/environment';

export interface OrderItem {
  ProductId: number;
  Quantity: number;
  Price: number;
  productName?: string;
  productShortName?: string;
  addedDate?: string;
  productImageUrl?: string;
  categoryName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  apiUrl: string = 'https://freeapi.miniprojectideas.com/api/BigBasket/';
  onCartAdded: Subject<boolean> = new Subject<boolean>();
  loggedUserData: Customer = new Customer();

  constructor(private http: HttpClient) {
    const isUser = localStorage.getItem(Constant.LOCAL_KEY);
    if (isUser != null) {
      const parseObj = JSON.parse(isUser);
      this.loggedUserData = parseObj;
    }
  }

  // Get all products
  getAllProducts(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(this.apiUrl + 'GetAllProducts');
  }

  // Get all categories
  getAllCategory(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(this.apiUrl + 'GetAllCategory');
  }

  // Get products by category
  getAllProductsByCategoryId(categoryId: number): Observable<APIResponseModel> {
    const url = `${this.apiUrl}GetAllProductsByCategoryId?id=${categoryId}`;
    return this.http.get<APIResponseModel>(url);
  }

  // Register new customer
  registerNewCustomer(obj: Customer): Observable<APIResponseModel> {
    const url = `${this.apiUrl}RegisterCustomer`;
    return this.http.post<APIResponseModel>(url, obj);
  }

  // Add to cart
  addToCart(obj: CartModel): Observable<APIResponseModel> {
    const url = `${this.apiUrl}AddToCart`;
    return this.http.post<APIResponseModel>(url, obj);
  }

  // Login
  onLogin(obj: LoginModel): Observable<APIResponseModel> {
    debugger;
    const url = `${this.apiUrl}Login`;
    return this.http.post<APIResponseModel>(url, obj);
  }

  // Get cart items
  getCartProductsByCustomerId(
    loggedUserId: number
  ): Observable<APIResponseModel> {
    const url = `${this.apiUrl}GetCartProductsByCustomerId?id=${loggedUserId}`;
    return this.http.get<APIResponseModel>(url);
  }

  // Delete single cart item
  deleteProductFromCartById(cartId: number): Observable<APIResponseModel> {
    const url = `${this.apiUrl}DeleteProductFromCartById?id=${cartId}`;
    return this.http.get<APIResponseModel>(url);
  }

  onPlaceOrder(
    orderData: OrderModel & { OrderItems?: OrderItem[] }
  ): Observable<APIResponseModel> {
    const url = `${this.apiUrl}PlaceOrder`;
    const payload = {
      CustId: orderData.CustId,
      TotalInvoiceAmount: orderData.TotalInvoiceAmount,
      OrderItems: orderData.OrderItems || [],
    };

    return this.http
      .post<APIResponseModel>(url, payload)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
