import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostoenvioComponent } from './costoenvio.component';
import { CreateCostoComponent } from './create-costo/create-costo.component';
import { ListCostoComponent } from './list-costo/list-costo.component';
import { EditCostoComponent } from './edit-costo/edit-costo.component';

const routes: Routes = [
  {
    path: "",
    component: CostoenvioComponent,
    children: [
      {
        path: 'register',
        component: CreateCostoComponent
      },
      {
        path: 'list',
        component: ListCostoComponent
      },
      {
        path: 'list/edit/:id',
        component: EditCostoComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostoenvioRoutingModule { }
