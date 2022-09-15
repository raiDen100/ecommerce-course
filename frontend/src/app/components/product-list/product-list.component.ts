import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  isSearch: boolean;
  products: Product[];
  currentCategory: number = 1;
  previousCategory: number = 1;

  constructor(private productService: ProductService, private cartService: CartServiceService, private route: ActivatedRoute, private router: Router) { }

  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    })
  }

  addToCart(product: Product){
    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }


  listProducts(){
    this.isSearch = this.route.snapshot.paramMap.has('keyword');

    if(this.isSearch){
      this.handleSearchProductsPaginate();
      return;
    }
    this.handleListProducts();

  }

  changePage(){
    //console.log(this.router);
    
    //this.router.navigate([`category/${this.currentCategory}/page/${this.pageNumber}`]);
    this.listProducts();
  }

  handleSearchProducts(){
    const hasKeyword = this.route.snapshot.paramMap.has("keyword");
    const keyword: string = String(this.route.snapshot.paramMap.get("keyword"));

      this.productService.getProductsListByName(keyword).subscribe(
        data=>{
          this.products = data;
        }
      )
  }

  handleSearchProductsPaginate(){
    const hasKeyword = this.route.snapshot.paramMap.has("keyword");
    const keyword: string = String(this.route.snapshot.paramMap.get("keyword"));

      this.productService.getProductsPaginate(keyword, this.pageNumber-1, this.pageSize).subscribe(
      this.processResult()
      );
  }


  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    this.currentCategory = 1;
    if(hasCategoryId){
      this.currentCategory = Number(this.route.snapshot.paramMap.get('id'));
    }

    //if(this.route.snapshot.paramMap.has('page'))
    //  this.pageNumber = Number(this.route.snapshot.paramMap.get('page'));

    if(this.currentCategory != this.previousCategory)
      this.pageNumber = 1;

    this.previousCategory = this.currentCategory;
    this.productService.getProductsListPaginate(this.pageNumber-1, this.pageSize, this.currentCategory).subscribe(

        this.processResult()
      
    );
  }

  updatePageSize(event: Event){
    const size: number = Number((event.target as HTMLInputElement).value);
    this.pageSize = size;
    this.pageNumber = 1;
    this.listProducts();
  }

  private processResult(){
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number+1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }
}
