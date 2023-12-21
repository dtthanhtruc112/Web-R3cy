import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CartService } from "./cart.service";


@NgModule({
    imports: [CommonModule],
    providers: []
})
export class OrdersModule {
    constructor (cartService: CartService) {
        cartService.initCartLocalStorage();

    }
}