export interface APIResponseModel {
  message: string;
  result: boolean;
  data: any;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  parentCategoryId: number;
  userId: number;
}

export interface CartData {
  cartId: number;
  custId: number;
  productId: number;
  quantity: number;
  productName: string;
  productPrice: number;
  productShortName: string;
  addedDate: string;
  productImageUrl: string;
  categoryName: string;
}

export class Customer {
  custId: number;
  name: string;
  MobileNo: string;
  Password: string;

  constructor() {
    this.custId = 0;
    this.name = '';
    this.MobileNo = '';
    this.Password = '';
  }
}
export interface OrderItem {
  ProductId: number;
  Quantity: number;
  Price: number;
}

export class OrderModel {
  SaleId: number;
  CustId: number;
  SaleDate: Date;
  TotalInvoiceAmount: number;
  Discount: number;
  PaymentNaration: string;
  DeliveryAddress1: string;
  DeliveryAddress2: string;
  DeliveryCity: string;
  DeliveryPinCode: string;
  DeliveryLandMark: string;
  IsCanceled: boolean;
  OrderItems?: OrderItem[];

  constructor() {
    this.SaleId = 0;
    this.CustId = 0;
    this.SaleDate = new Date();
    this.TotalInvoiceAmount = 0;
    this.Discount = 0;
    this.PaymentNaration = '';
    this.DeliveryAddress1 = '';
    this.DeliveryAddress2 = '';
    this.DeliveryCity = '';
    this.DeliveryPinCode = '';
    this.DeliveryLandMark = '';
    this.IsCanceled = false;
    this.OrderItems = [];
  }
}

export class LoginModel {
  UserName: string;
  UserPassword: string;

  constructor() {
    this.UserName = '';
    this.UserPassword = '';
  }
}

export class CartModel {
  CartId: number;
  custId: number;
  ProductId: number;
  Quantity: number;
  AddedDate: Date;

  constructor() {
    this.CartId = 0;
    this.custId = 0;
    this.ProductId = 0;
    this.Quantity = 1;
    this.AddedDate = new Date();
  }
}

export interface ProductList {
  productId: number;
  productSku: string;
  productName: string;
  productPrice: number;
  productShortName: string;
  productDescription: string;
  createdDate: string;
  deliveryTimeSpan: string;
  categoryId: number;
  productImageUrl: string;
  categoryName: string;
}