import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DiscountService } from '../service/discount.service';
import { ActivatedRoute } from '@angular/router';
import { URL_TIENDA } from 'src/app/config/config';

@Component({
  selector: 'app-edit-discount',
  templateUrl: './edit-discount.component.html',
  styleUrls: ['./edit-discount.component.scss']
})
export class EditDiscountComponent {

  isLoading$: any;
  type_discount: number = 1;
  discount: number = 0;
  discount_type: number = 1;
  product_id: any;
  categorie_id: any;
  brand_id: any;

  state: number = 1;

  type_campaing: number = 1;

  start_date: any;
  end_date: any;

  categories_add: any = [];
  products_add: any = [];
  brands_add: any = [];

  categories_first: any = [];
  products: any = [];
  brands: any = [];

  DISCOUNT_ID:any;
  DISCOUNT_SELECTED:any;

  constructor(
    public discountService: DiscountService,
    public toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.isLoading$ = this.discountService.isLoading$;
    this.activatedRoute.params.subscribe((resp:any) => {
      this.DISCOUNT_ID = resp.id;
    })

    this.discountService.showDiscount(this.DISCOUNT_ID).subscribe((resp:any) => {
      console.log(resp)

      this.DISCOUNT_SELECTED = resp.discount;

      this.type_discount = resp.discount.type_discount;
      this.discount_type = resp.discount.discount_type;
      this.discount = resp.discount.discount;
      this.products_add = resp.discount.products;
      this.categories_add = resp.discount.categories;
      this.brands_add = resp.discount.brands;
      this.start_date = resp.discount.start_date;
      this.end_date = resp.discount.end_date;
      this.type_campaing = resp.discount.type_campaing;
      this.state = resp.discount.state;

    });


    this.discountService.configDiscounts().subscribe((resp: any) => {
      this.categories_first = resp.categories;
      this.products = resp.products;
      this.brands = resp.brands;
    });
  }

  changeTypeDiscount(value: number) {
    this.type_discount = value;
  }
  changeTypeCampaing(value: number) {
    this.type_campaing = value;
  }
  changeTypeCupone(value: number) {
    this.discount_type = value;
    //limpiar campos
    this.products_add = [];
    this.categories_add = [];
    this.brands_add = [];
    this.product_id = null;
    this.categorie_id = null;
    this.brand_id = null;
  }

  save() {
    if (!this.discount || !this.start_date || !this.end_date) {
      this.toastr.error('Validacion', 'Nesecitas llenar todos los campos');
      return;
    }

    if (this.discount_type == 1 && this.products_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos un producto'
      );
      return;
    }
    if (this.discount_type == 2 && this.categories_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos una categoria'
      );
      return;
    }
    if (this.discount_type == 3 && this.brands_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos una marca'
      );
      return;
    }

    let data = {
      type_discount: this.type_discount,
      discount_type: this.discount_type,
      discount: this.discount,

      product_selected: this.products_add,
      categorie_selected: this.categories_add,
      brand_selected: this.brands_add,
      start_date: this.start_date,
      end_date: this.end_date,
      type_campaing: this.type_campaing,
      state: this.state,

    };

    this.discountService.updateDiscounts(this.DISCOUNT_ID, data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Validacion', resp.message_text);
      } else {
        this.toastr.success('Exito', 'El descuento se edito correctamente');
        // this.type_discount = 1;
        // this.discount_type = 1;
        // this.discount = 0;
        // this.products_add = [];
        // this.categories_add = [];
        // this.brands_add = [];
        // this.product_id = null;
        // this.categorie_id = null;
        // this.brand_id = null;
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

  copyLink(product: any) {
      var aux = document.createElement('input');
      aux.setAttribute('value', URL_TIENDA + '/producto/'+product.slug+"?campaing_discount=" + this.DISCOUNT_SELECTED.code);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand('copy');
      document.body.removeChild(aux);
      this.toastr.info("Copiado", 'LINK DE DESCUENTO')
    }
}
