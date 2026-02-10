import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CreateVariacionesSpecificationsComponent } from './attributes/create-variaciones-specifications/create-variaciones-specifications.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {
        path: 'register',
        component: CreateProductComponent
      },
      {
        path: 'list',
        component: ListProductsComponent
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./product-details/product-details.component')
          .then(m => m.ProductDetailsComponent)  // <-- Lazy load
      },
      {
        path: 'list/edit/:id',
        component: EditProductComponent
      },
      {
        path: 'list/variations-specifications/:id',
        component: CreateVariacionesSpecificationsComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
