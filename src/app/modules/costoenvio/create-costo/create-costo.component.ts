import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CostosenvioService } from '../service/costoenvio.service';

@Component({
  selector: 'app-create-costo',
  templateUrl: './create-costo.component.html',
  styleUrls: ['./create-costo.component.scss']
})
export class CreateCostoComponent {
  code: any;
  isLoading$: any;
  type_discount: number = 1;
  discount: number = 0;
  type_count: number = 1;
  type_costo: number = 1;
  product_id: any;
  categorie_id: any;
  brand_id: any;
  num_use: number = 0;

  categories_add: any = [];
  products_add: any = [];
  brands_add: any = [];

  categories_first: any = [];
  products: any = [];
  brands: any = [];

  constructor(
    public costosService: CostosenvioService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.isLoading$ = this.costosService.isLoading$;

    this.costosService.configCostos().subscribe((resp: any) => {
      this.categories_first = resp.categories;
      this.products = resp.products;
      this.brands = resp.brands;
    });
  }

  changeTypeDiscount(value: number) {
    this.type_discount = value;
  }
  changeTypeCount(value: number) {
    this.type_count = value;
  }
  changeTypeCupone(value: number) {
    this.type_costo = value;
    //limpiar campos
    this.products_add = [];
    this.categories_add = [];
    this.brands_add = [];
    this.product_id = null;
    this.categorie_id = null;
    this.brand_id = null;
  }

  save() {
    if (!this.code || !this.discount) {
      this.toastr.error('Validacion', 'Es necesario llenar todos los campos');
      return;
    }
    if (this.type_count == 2 && this.num_use == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario llenar el numero de usos al cupon'
      );
      return;
    }

    if (this.type_costo == 1 && this.products_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos un producto'
      );
      return;
    }
    if (this.type_costo == 2 && this.categories_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos una categoria'
      );
      return;
    }
    if (this.type_costo == 3 && this.brands_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos una marca'
      );
      return;
    }

    let data = {
      type_discount: this.type_discount,
      type_costo: this.type_costo,
      type_count: this.type_count,
      discount: this.discount,
      num_use: this.num_use,
      code: this.code,

      product_selected: this.products_add,
      categorie_selected: this.categories_add,
      brand_selected: this.brands_add,
    };

    this.costosService.createCosto(data).subscribe((resp: any) => {
      //console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Validacion', resp.message);
      } else {
        this.toastr.success('Exito', 'El costo se registro correctamente');
        this.type_discount = 1;
        this.type_count = 1;
        this.type_costo = 1;
        this.num_use = 0;
        this.discount = 0;
        this.code = null;
        this.products_add = [];
        this.categories_add = [];
        this.brands_add = [];
        this.product_id = null;
        this.categorie_id = null;
        this.brand_id = null;
      }
    });
  }

  addProduct() {
    if (!this.product_id) {
      this.toastr.error('Validacion', 'Es necesario seleccionar un producto');
      return;
    }
    let INDEX = this.products_add.findIndex(
      (prod: any) => prod.id == this.product_id
    );
    if (INDEX != -1) {
      this.toastr.error(
        'Validacion',
        'Este producto ya se encuentra en la lista'
      );
      return;
    }

    let DATA = this.products.find(
      (product: any) => product.id == this.product_id
    );
    if (DATA) {
      this.products_add.push(DATA);
    }
  }
  addCategorie() {
    if (!this.categorie_id) {
      this.toastr.error('Validacion', 'Es necesario seleccionar una categoria');
      return;
    }
    let INDEX = this.categories_add.findIndex(
      (prod: any) => prod.id == this.categorie_id
    );
    if (INDEX != -1) {
      this.toastr.error(
        'Validacion',
        'Esta categoria ya se encuentra en la lista'
      );
      return;
    }

    let DATA = this.categories_first.find(
      (categorie: any) => categorie.id == this.categorie_id
    );
    if (DATA) {
      this.categories_add.push(DATA);
    }
  }
  addBrand() {
    if (!this.brand_id) {
      this.toastr.error('Validacion', 'Es necesario seleccionar una marca');
      return;
    }
    let INDEX = this.brands_add.findIndex(
      (prod: any) => prod.id == this.brand_id
    );
    if (INDEX != -1) {
      this.toastr.error('Validacion', 'Esta marca ya se encuentra en la lista');
      return;
    }

    let DATA = this.brands.find((brand: any) => brand.id == this.brand_id);
    if (DATA) {
      this.brands_add.push(DATA);
    }
  }

  removeProduct(product: any) {
    let INDEX = this.products_add.findIndex(
      (prod: any) => prod.id == product.id
    );
    if (INDEX != -1) {
      this.products_add.splice(INDEX, 1);
    }
  }

  removeCategorie(categorie: any) {
    let INDEX = this.categories_add.findIndex(
      (prod: any) => prod.id == categorie.id
    );
    if (INDEX != -1) {
      this.categories_add.splice(INDEX, 1);
    }
  }

  removeBrand(brand: any) {
    let INDEX = this.brands_add.findIndex((prod: any) => prod.id == brand.id);
    if (INDEX != -1) {
      this.brands_add.splice(INDEX, 1);
    }
  }

  addAllBrands() {
  if (!this.brands || this.brands.length === 0) {
    this.toastr.error('Validación', 'No hay marcas disponibles');
    return;
  }

  this.brands_add = [...this.brands];
}

}
