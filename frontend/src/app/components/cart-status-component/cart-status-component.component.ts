import { Component, OnInit } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { CartServiceService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-status-component',
  templateUrl: './cart-status-component.component.html',
  styleUrls: ['./cart-status-component.component.css']
})
export class CartStatusComponentComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus(){
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
