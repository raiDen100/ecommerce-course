import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartServiceService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartProducts: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  isChanging: boolean = false;

  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails(){
    this.cartProducts = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    this.cartService.computeCartTotals();
  }

  decrementItemQuantity(cartItem: CartItem){
    this.cartService.removeFromCart(cartItem)
  }

  incrementItemQuantity(cartItem: CartItem){
    this.cartService.addToCart(cartItem)
  }


  remove(cartItem: CartItem){
    this.cartService.remove(cartItem);
  }

}
