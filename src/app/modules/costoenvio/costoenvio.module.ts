import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostoenvioRoutingModule } from './costoenvio-routing.module';
import { CostoenvioComponent } from './costoenvio.component';
import { CreateCostoComponent } from './create-costo/create-costo.component';
import { EditCostoComponent } from './edit-costo/edit-costo.component';
import { DeleteCostoComponent } from './delete-costo/delete-costo.component';
import { ListCostoComponent } from './list-costo/list-costo.component';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    CostoenvioComponent,
    CreateCostoComponent,
    EditCostoComponent,
    DeleteCostoComponent,
    ListCostoComponent
  ],
  imports: [
    CommonModule,
    CostoenvioRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class CostoenvioModule { }
