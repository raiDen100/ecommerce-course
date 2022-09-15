package com.raiden.ecommerce.dto;

import com.raiden.ecommerce.entity.Address;
import com.raiden.ecommerce.entity.Customer;
import com.raiden.ecommerce.entity.Order;
import com.raiden.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
