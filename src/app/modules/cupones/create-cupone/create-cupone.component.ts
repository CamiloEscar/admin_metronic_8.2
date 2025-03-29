import { Component } from '@angular/core';

@Component({
  selector: 'app-create-cupone',
  templateUrl: './create-cupone.component.html',
  styleUrls: ['./create-cupone.component.scss'],
})
export class CreateCuponeComponent {
  code: any;
  isLoading$: any;
  type_discount: number = 1;
  discount:number = 0;
  type_count:number = 1;
  type_cupone:number = 1;
  product_id:any;
  categorie_id:any;
  brand_id:any;
  num_use:number = 0;

  categories_add:any = [];
  products_add:any = [];
  brands_add:any = [];

  categories_first:any = [];
  products:any = [];
  brands:any = [];

  constructor() {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  changeTypeDiscount(value: number) {
    this.type_discount = value;
  }
  changeTypeCount(value: number) {
    this.type_count = value;
  }
  changeTypeCupone(value: number) {
    this.type_cupone = value;
  }


  save() {}

  removeProduct(product:any){

  }

  removeCategorie(categorie:any){

  }

  removeBrand(brand:any){

  }
}
