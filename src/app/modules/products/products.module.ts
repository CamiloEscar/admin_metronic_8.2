import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


import {
  NgbModule,
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DeleteImagenAddComponent } from './edit-product/delete-imagen-add/delete-imagen-add.component';
import { CreateVariacionesSpecificationsComponent } from './attributes/create-variaciones-specifications/create-variaciones-specifications.component';
import { EditVariacionesSpecificationsComponent } from './attributes/edit-variaciones-specifications/edit-variaciones-specifications.component';
import { DeleteVariacionesSpecificationsComponent } from './attributes/delete-variaciones-specifications/delete-variaciones-specifications.component';
import { CreateAnidadoVariacionesComponent } from './attributes/create-anidado-variaciones/create-anidado-variaciones.component';
import { EditAnidadoVariacionesComponent } from './attributes/edit-anidado-variaciones/edit-anidado-variaciones.component';
import { DeleteAnidadoVariacionesComponent } from './attributes/delete-anidado-variaciones/delete-anidado-variaciones.component';

@NgModule({
  declarations: [
    ProductsComponent,
    CreateProductComponent,
    EditProductComponent,
    ListProductsComponent,
    DeleteProductComponent,
    DeleteImagenAddComponent,
    CreateVariacionesSpecificationsComponent,
    EditVariacionesSpecificationsComponent,
    DeleteVariacionesSpecificationsComponent,
    CreateAnidadoVariacionesComponent,
    EditAnidadoVariacionesComponent,
    DeleteAnidadoVariacionesComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    CKEditorModule,
    NgMultiSelectDropDownModule.forRoot(),

    NgbPaginationModule,
  ],
})
export class ProductsModule {}
