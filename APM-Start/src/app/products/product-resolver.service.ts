import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { ProductService } from './product.service';
import { IProduct } from './product';

@Injectable()
export class ProductResolver implements Resolve<IProduct> {
    constructor(private _router: Router,
                private _productService: ProductService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct> {
        let id = route.params['id'];

        if (isNaN(id)) {
            console.log(`Product id was not a number: ${id}`);
            this._router.navigate(['/products']);
            return Observable.of(null);
        }

        return this._productService.getProduct(+id)
                    .map(product => {
                        if (product) {
                            return product;
                        }

                        console.log(`Product was not found: ${id}`);
                        this._router.navigate(['/products']);
                        return null;
                    })
                    .catch(error => {
                        console.log(`Retrieval error: ${error}`);
                        this._router.navigate(['/products']);
                        return Observable.of(null);
                    });
    }
}
