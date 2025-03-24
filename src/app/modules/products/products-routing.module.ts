import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CreateVariacionesSpecificationsComponent } from './attributes/create-variaciones-specifications/create-variaciones-specifications.component';

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
