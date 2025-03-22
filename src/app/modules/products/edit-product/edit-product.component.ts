import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent {
  title: string = '';
  sku: string = '';
  price_ars: number = 0;
  price_usd: number = 0;
  description: any = '';
  resumen: string = '';
  imagen_previsualizacion: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  file_imagen: any = null;
  marca_id: string = '';
  marcas: any = [];

  isLoading$: any;

  categorie_first_id: any = [];
  categorie_second_id: any = [];
  categorie_third_id: any = [];
  categorie_first: any = [];
  categorie_seconds: any = [];
  categorie_thirds: any = [];
  categorie_seconds_backups: any = [];
  categorie_thirds_backups: any = [];

  dropdownList: any = [];
  selectedItemsTags: any = [];
  dropdownSettings: IDropdownSettings = {};
  word: string = '';

  isShowMultiselect: boolean = false;
  PRODUCT_ID: string = '';
  PRODUCT_SELECT: any;

  constructor(
    public productService: ProductService,
    public toastr: ToastrService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.productService.isLoading$;

    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Mumbai' },
    //   { item_id: 2, item_text: 'Bangaluru' },
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    //   { item_id: 5, item_text: 'New Delhi' },
    // ];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.activatedRoute.params.subscribe((resp: any) => {
      console.log(resp);
      this.PRODUCT_ID = resp.id;
    });
    this.configAll();
  }

  configAll() {
    this.productService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.marcas = resp.brands;
      this.categorie_first = resp.categorie_first;
      this.categorie_seconds = resp.categorie_seconds;
      this.categorie_thirds = resp.categorie_thirds;
      this.showProduct();
    });
  }

  showProduct() {
    this.productService.showProduct(this.PRODUCT_ID).subscribe((resp: any) => {
      this.PRODUCT_SELECT = resp.product;
      this.title = resp.product.title;
      this.sku = resp.product.sku;
      this.price_ars = resp.product.price_ars;
      this.price_usd = resp.product.price_usd;
      this.description = resp.product.description;
      this.resumen = resp.product.resumen;
      this.imagen_previsualizacion = resp.product.imagen;
      this.marca_id = resp.product.brand_id;
      this.categorie_first_id = resp.product.categorie_first_id;
      this.categorie_second_id = resp.product.categorie_second_id;
      this.categorie_third_id = resp.product.categorie_third_id;
      this.selectedItemsTags = resp.product.selectedItemsTags;
      this.changeDepartamento();
      this.changeCategorie();

      this.dropdownList = resp.product.tags;
      this.selectedItemsTags = resp.product.tags;

    });
  }
  addItems() {
    this.isShowMultiselect = true;
    let time_date = new Date().getTime();
    this.dropdownList.push({ item_id: time_date, item_text: this.word });
    this.selectedItemsTags.push({ item_id: time_date, item_text: this.word });
    setTimeout(() => {
      this.word = ''; // Limpia el campo de entrada
      this.isShowMultiselect = false;
      this.isLoadingView();
    }, 100);
  }
  processFile($event: any) {
    const file = $event.target.files[0];

    // Verificar si el archivo es una imagen
    if (!file.type.startsWith('image/')) {
      this.toastr.error('El archivo seleccionado no es una imagen', 'Error');
      return;
    }

    this.file_imagen = file;
    console.log(this.file_imagen);

    // Leer el archivo y convertirlo en una URL para la previsualización
    const reader = new FileReader();
    reader.onload = () => {
      this.imagen_previsualizacion = reader.result; // Actualiza la previsualización
      this.isLoadingView();
    };
    reader.readAsDataURL(file);
  }

  onDescriptionChange(event: any) {
    this.description = event.editor.getData();
  }

  isLoadingView() {
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }

  changeDepartamento() {
    this.categorie_seconds_backups = this.categorie_seconds.filter(
      (item: any) => item.categorie_second_id == this.categorie_first_id
    );
  }

  changeCategorie() {
    this.categorie_thirds_backups = this.categorie_thirds.filter(
      (item: any) => item.categorie_second_id == this.categorie_second_id
    );
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  save() {
    if (
      !this.title ||
      !this.sku ||
      !this.price_ars ||
      !this.price_usd ||
      !this.marca_id ||
      !this.categorie_first_id ||
      !this.description ||
      !this.resumen ||
      this.selectedItemsTags.length === 0
    ) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);
    formData.append('sku', this.sku);
    formData.append('price_ars', this.price_ars + '');
    formData.append('price_usd', this.price_usd + '');
    formData.append('brand_id', this.marca_id);
    if (this.file_imagen) {
      formData.append('portada', this.file_imagen);
    }
    formData.append('categorie_first_id', this.categorie_first_id);
    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    }
    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    }
    formData.append('description', this.description);
    formData.append('resumen', this.resumen);
    formData.append('multiselect', JSON.stringify(this.selectedItemsTags));

    this.productService
      .updateProducts(formData, this.PRODUCT_ID)
      .subscribe((resp: any) => {
        console.log(resp);

        if (resp.message === 403) {
          this.toastr.error('No tiene permisos para crear productos', 'Error');
          return;
        } else {
          // this.title = '';
          // this.sku = '';
          // this.price_ars = 0;
          // this.price_usd = 0;
          // this.marca_id = '';
          // this.categorie_first_id = '';
          // this.categorie_second_id = '';
          // this.categorie_third_id = '';
          this.file_imagen = null;
          // this.description = '';
          // this.resumen = '';
          // this.selectedItemsTags = [];

          // (this.imagen_previsualizacion =
          //   'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg'),
            this.toastr.success('El producto editado exitosamente', 'Éxito');
        }
      });
  }
}
