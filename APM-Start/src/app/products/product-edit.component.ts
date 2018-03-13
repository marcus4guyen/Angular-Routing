import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../messages/message.service';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
    templateUrl: './app/products/product-edit.component.html',
    styleUrls: ['./app/products/product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
    pageTitle: string = 'Product Edit';
    errorMessage: string;

    private dataIsValid: { [key: string]: boolean } = {};
    private currentProduct: IProduct;
    private originalProduct: IProduct;

    get product(): IProduct {
        return this.currentProduct;
    }

    set product(value: IProduct) {
        this.currentProduct = value;
        // clone the object to retain a copy
        this.originalProduct = Object.assign({}, value);
    }

    get isDirty(): boolean {
        return JSON.stringify(this.originalProduct) !== JSON.stringify(this.currentProduct);
    }

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private productService: ProductService,
                private messageService: MessageService) { }

    ngOnInit() {
        /* this._route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getProduct(id);
            }
        ); */
        this._route.data.subscribe(
            data => {
                this.onProductRetrieved(data['product']);
            }
        );
    }

    getProduct(id: number): void {
        this.productService.getProduct(id)
            .subscribe(
                (product: IProduct) => this.onProductRetrieved(product),
                (error: any) => this.errorMessage = <any>error
            );
    }

    onProductRetrieved(product: IProduct): void {
        this.product = product;

        if (this.product.id === 0) {
            this.pageTitle = 'Add Product';
        } else {
            this.pageTitle = `Edit Product: ${this.product.productName}`;
        }
    }

    deleteProduct(): void {
        if (this.product.id === 0) {
            // Don't delete, it was never saved.
            this.onSaveComplete();
       } else {
            if (confirm(`Really delete the product: ${this.product.productName}?`)) {
                this.productService.deleteProduct(this.product.id)
                    .subscribe(
                        () => this.onSaveComplete(`${this.product.productName} was deleted`),
                        (error: any) => this.errorMessage = <any>error
                    );
            }
        }
    }

    isValid(path: string): boolean {
        this.validate();

        if (path) {
            return this.dataIsValid[path];
        }

        return (this.dataIsValid && Object.keys(this.dataIsValid).every(d => this.dataIsValid[d] === true));
    }

    reset(): void {
        this.dataIsValid = null;
        this.originalProduct = null;
        this.currentProduct = null;
    }

    saveProduct(): void {
        if (this.isValid(null)) {
            this.productService.saveProduct(this.product)
                .subscribe(
                    () => this.onSaveComplete(`${this.product.productName} was saved`),
                    (error: any) => this.errorMessage = <any>error
                );
        } else {
            this.errorMessage = 'Please correct the validation errors.';
        }
    }

    onSaveComplete(message?: string): void {
        if (message) {
            this.messageService.addMessage(message);
        }

        this.reset();

        // Navigate back to the product list
        this._router.navigate(['/products']);
    }

    validate(): void {
        // clear the validation object
        this.dataIsValid = {};

        // 'info' tab
        if (this.product &&
            this.product.productName &&
            this.product.productName.length >= 3 &&
            this.product.productCode) {
            this.dataIsValid['info'] = true;
        } else {
            this.dataIsValid['info'] = false;
        }

        // 'tags' tab
        if (this.product &&
            this.product.category &&
            this.product.category.length >= 3) {
            this.dataIsValid['tags'] = true;
        } else {
            this.dataIsValid['tags'] = false;
        }
    }
}
