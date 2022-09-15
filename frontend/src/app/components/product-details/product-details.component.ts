import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();

  constructor(private productService: ProductService, private cartService: CartServiceService, private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.loadProductDetails();
  }

  addToCart(){
    const cartItem = new CartItem(this.product);

    this.cartService.addToCart(cartItem);
  }

  loadProductDetails(){
    const productId: number = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProduct(productId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

}
