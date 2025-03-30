import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CuponesService } from '../service/cupones.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-cupone',
  templateUrl: './edit-cupone.component.html',
  styleUrls: ['./edit-cupone.component.scss'],
})
export class EditCuponeComponent {

  code: any;
  isLoading$: any;
  type_discount: number = 1;
  discount: number = 0;
  type_count: number = 1;
  type_cupone: number = 1;
  product_id: any;
  categorie_id: any;
  brand_id: any;
  num_use: number = 0;
  state:number = 1;

  categories_add: any = [];
  products_add: any = [];
  brands_add: any = [];

  categories_first: any = [];
  products: any = [];
  brands: any = [];

  CUPONE_ID: any;
  CUPONE_SELECTED: any;

  constructor(
    public cuponesService: CuponesService,
    public toastr: ToastrService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.isLoading$ = this.cuponesService.isLoading$;

    this.cuponesService.configCupones().subscribe((resp: any) => {
      this.categories_first = resp.categories;
      this.products = resp.products;
      this.brands = resp.brands;
    });

    this.activatedRoute.params.subscribe((resp: any) => {
      this.CUPONE_ID = resp.id;
    });

    this.cuponesService.showCupone(this.CUPONE_ID).subscribe((resp: any) => {
      console.log(resp);

      this.CUPONE_SELECTED = resp.cupone;
      this.code = resp.cupone.code;
      this.type_discount = resp.cupone.type_discount;
      this.discount = resp.cupone.discount;
      this.type_count = resp.cupone.type_count;
      this.num_use = resp.cupone.num_use;
      this.type_cupone = resp.cupone.type_cupone;
      this.state = resp.cupone.state;

      // Remove duplicates from products based on product id
      const uniqueProducts = [];
      const productIds = new Set();

      for (const product of resp.cupone.products) {
        if (!productIds.has(product.id)) {
          uniqueProducts.push(product);
          productIds.add(product.id);
        }
      }

      this.products_add = uniqueProducts;
      this.categories_add = resp.cupone.categories;
      this.brands_add = resp.cupone.brands;
    });
  }

  changeTypeDiscount(value: number) {
    this.type_discount = value;
  }
  changeTypeCount(value: number) {
    this.type_count = value;
  }
  changeTypeCupone(value: number) {
    this.type_cupone = value;
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

    if (this.type_cupone == 1 && this.products_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos un producto'
      );
      return;
    }
    if (this.type_cupone == 2 && this.categories_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos una categoria'
      );
      return;
    }
    if (this.type_cupone == 3 && this.brands_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos una marca'
      );
      return;
    }

    let data = {
      type_discount: this.type_discount,
      type_cupone: this.type_cupone,
      type_count: this.type_count,
      discount: this.discount,
      num_use: this.num_use,
      code: this.code,

      product_selected: this.products_add,
      categorie_selected: this.categories_add,
      brand_selected: this.brands_add,
      state: this.state,
    };

    this.cuponesService.updateCupones(this.CUPONE_ID, data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Validacion', resp.message);
      } else {
        this.toastr.success('Exito', 'El cupon se actualizo correctamente');
        this.type_discount = 1;
        this.type_count = 1;
        this.type_cupone = 1;
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
      // Create a copy of the product with a new id_aux if needed
      const productToAdd = {...DATA};
      // Add a unique id_aux if it doesn't exist
      if (!productToAdd.id_aux) {
        productToAdd.id_aux = Date.now(); // Use timestamp for uniqueness
      }
      this.products_add.push(productToAdd);
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
}
