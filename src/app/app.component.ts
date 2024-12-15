import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  APIResponseModel,
  CartData,
  Customer,
  LoginModel,
} from './model/Product';
import { FormsModule } from '@angular/forms';
import { MasterService } from './service/master.service';
import { Constant } from './constant/constant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'capstone-project';

  registerObj: Customer = new Customer();
  loginObj: LoginModel = new LoginModel();
  loggedUserData: Customer = new Customer();

  masterService = inject(MasterService);

  @ViewChild('registerModel') registerModel: ElementRef | undefined;
  @ViewChild('loginModel') loginModel: ElementRef | undefined;

  isCartPopupOpen: boolean = false;
  cartData: CartData[] = [];

  ngOnInit(): void {
    const isUser = localStorage.getItem(Constant.LOCAL_KEY);
    if (isUser != null) {
      const parseObj = JSON.parse(isUser);
      this.loggedUserData = parseObj;
      this.getCartItems();
    }
    this.masterService.onCartAdded.subscribe((res: boolean) => {
      if (res) {
        this.getCartItems();
      }
    });
  }

  getCartItems() {
    this.masterService
      .getCartProductsByCustomerId(this.loggedUserData.custId)
      .subscribe((res: APIResponseModel) => {
        this.cartData = res.data;
      });
  }

  onRemoveProduct(cartId: number) {
    this.masterService
      .deleteProductFromCartById(cartId)
      .subscribe((res: APIResponseModel) => {
        if (res.result) {
          alert('Product removed from cart');
          this.getCartItems();
        } else {
          alert(res.message);
        }
      });
  }

  showCartPopup() {
    this.isCartPopupOpen = !this.isCartPopupOpen;
  }

  logOff() {
    localStorage.removeItem(Constant.LOCAL_KEY);
    this.loggedUserData = new Customer();
  }

  openRegisterModel() {
    if (this.registerModel) {
      this.registerModel.nativeElement.style.display = 'block';
    }
  }

  closeRegisterModel() {
    if (this.registerModel) {
      this.registerModel.nativeElement.style.display = 'none';
    }
  }
  openLoginModel() {
    if (this.loginModel) {
      this.loginModel.nativeElement.style.display = 'block';
    }
  }

  closeLoginModel() {
    if (this.loginModel) {
      this.loginModel.nativeElement.style.display = 'none';
    }
  }

  onRegister() {
    debugger;
    this.masterService
      .registerNewCustomer(this.registerObj)
      .subscribe((res: APIResponseModel) => {
        if (res.result) {
          alert('Register Successfully');
          this.closeRegisterModel();
        } else {
          alert(res.message);
        }
      });
  }

  onLogin() {
    debugger;
    this.masterService
      .onLogin(this.loginObj)
      .subscribe((res: APIResponseModel) => {
        if (res.result) {
          this.loggedUserData = res.data;
          localStorage.setItem(Constant.LOCAL_KEY, JSON.stringify(res.data));
          this.closeLoginModel();
        } else {
          alert(res.message);
        }
      });
  }
}
