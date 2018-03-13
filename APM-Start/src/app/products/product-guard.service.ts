import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { ProductEditComponent } from './product-edit.component';

export class ProductEditGuard implements CanDeactivate<ProductEditComponent> {
    canDeactivate(component: ProductEditComponent): boolean {
        if (component.isDirty) {
            let productName = component.product.productName || 'New Product';
            return confirm(`Naviagte away and lose all changes to ${productName}?`);
        }

        return true;
    }
}