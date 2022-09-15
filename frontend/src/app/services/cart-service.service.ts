import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  removeFromCart(cartItem: CartItem){

    cartItem.quantity--;
    if(cartItem.quantity <= 0)
      return this.remove(cartItem);

    this.computeCartTotals();
  }

  
  remove(cartItem: CartItem){

    let itemIndex: number = this.cartItems.indexOf(cartItem, 0)

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }

  } 
  addToCart(cartItem: CartItem){
    let alreadyInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);
    alreadyInCart = (existingCartItem != undefined);
    if(alreadyInCart){
      existingCartItem!.quantity++;
    }else{
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();

  }


  computeCartTotals(){
    let totalPrice: number = 0;
    let totalQuantity: number = 0;

    for(let cartItem of this.cartItems){
      totalPrice += cartItem.quantity * cartItem.unitPrice;
      totalQuantity += cartItem.quantity;
    }

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);
  }
}
