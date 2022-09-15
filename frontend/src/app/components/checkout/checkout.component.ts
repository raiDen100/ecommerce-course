import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { State } from 'src/app/common/state';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { FormService } from 'src/app/services/form.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  customerForm: FormGroup = this.formBuilder.group({
    'firstName': new FormControl('',
      [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]
    ),
    'lastName': new FormControl('',
      [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]
    ),
    'email': new FormControl('',
      [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]
    ),
  });

  shippingForm: FormGroup = this.formBuilder.group({
    'country': new FormControl('',
      [Validators.required]
    ),
    'street': new FormControl('',
      [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]
    ),
    'city': new FormControl('',
      [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]
    ),
    'state': new FormControl('',
      [Validators.required]
    ),
    'zipCode': new FormControl('',
      [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]
    ),// TODO: regex
  });

  billingForm: FormGroup = this.formBuilder.group({
    'country': new FormControl('',
      [Validators.required]
    ),
    'street': new FormControl('',
      [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]
    ),
    'city': new FormControl('',
      [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]
    ),
    'state': new FormControl('',
      [Validators.required]
    ),
    'zipCode': new FormControl('',
      [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]
    ),// TODO: regex
  });

  creditCardForm: FormGroup = this.formBuilder.group({
    'cardType': new FormControl('',
    [Validators.required]),
    'nameOnCard': new FormControl('',
      [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]
    ),
    'cardNumber': new FormControl('',
      [Validators.required, Validators.pattern('^[0-9]{16}')]
    ),
    'securityCode': new FormControl('',
      [Validators.required, Validators.pattern('^[0-9]{3}'), CustomValidators.notOnlyWhitespace]
    ),
    'expirationMonth': new FormControl('',
      [Validators.required]),
    'expirationYear': new FormControl('',
      [Validators.required])
  });
  
    totalPrice: number = 0;
    totalQuantity: number = 0;

    creditCardYears: number[] = [];
    creditCardMonths: number[] = [];

    countries: Country[] = [];
    shippingAddressStates: State[] = [];
    billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private cartService : CartServiceService,
              private formService: FormService,
              private checkoutService: CheckoutService,
              private router: Router) { }


  ngOnInit(): void {
    const startMonth: number = new Date().getMonth() +1;

    this.formService.getCreditCardMonths(startMonth).subscribe(data => {
      this.creditCardMonths = data
    });

    this.formService.getCreditCardYears().subscribe(data => {
      this.creditCardYears = data
    });

    this.reviewCartDetails();

    this.formService.getCountries().subscribe(data => {
      this.countries = data;
    })

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.customerForm,
      shippingAddress: this.shippingForm,
      billingAddress: this.billingForm,
      creditCard: this.creditCardForm
    })
  }

  private reviewCartDetails() {
    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data;
    });

    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    });
  }

  getStatesForCountry(formGroupName: string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.formService.getStates(countryCode).subscribe(data => {
      if(formGroupName === 'shippingAddress')
        this.shippingAddressStates = data;
      else
        this.billingAddressStates = data;
      formGroup?.get('state')?.setValue(data[0]);
      })
  }

  updateMonths(){
    const tempCreditCardForm = this.checkoutFormGroup.get('creditCard');
    let selectedYear: number = Number(tempCreditCardForm?.value.expirationYear);
    let currentYear: number = new Date().getFullYear();

    let startMonth: number = 1;
    if(selectedYear == currentYear)
      startMonth = new Date().getMonth() +1;
    
    this.formService.getCreditCardMonths(startMonth).subscribe(data => {
      this.creditCardMonths = data
    });
  }


  copyShippingAddressToBillingAddress(event: Event){
    let checkbox: HTMLInputElement = event.target as HTMLInputElement;
    if(checkbox.checked){
      this.billingForm.setValue(this.shippingForm.value);
      this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.billingForm.reset();
      this.billingAddressStates = [];
    }
      
    
  }
  
  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }
  get shippingCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get billingCountry(){ return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingStreet(){ return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingCity(){ return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingState(){ return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardName(){ return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardCode(){ return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardEMonth(){ return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardEYear(){ return this.checkoutFormGroup.get('creditCard.expirationYear'); }
  
  
  onSubmit(){
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(tCartItem => new OrderItem(tCartItem));

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;


    purchase.order = order;
    purchase.orderItems = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: err => {
        alert(`Coś jebło ${err.message}`);
      }
    });
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");
  }

}
