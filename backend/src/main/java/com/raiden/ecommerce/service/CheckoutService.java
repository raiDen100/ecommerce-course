package com.raiden.ecommerce.service;

import com.raiden.ecommerce.dto.Purchase;
import com.raiden.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
