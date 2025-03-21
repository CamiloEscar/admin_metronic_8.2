import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
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
  categorie_seconds_backups: any = [];
  categorie_thirds: any = [];
  categorie_thirds_backups: any = [];

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};

  isShowMultiselect: boolean = false;

  constructor(
    public productService: ProductService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.productService.isLoading$;

    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' },
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  addItems() {
    this.isShowMultiselect = true;
    this.dropdownList.push({ item_id: 6, item_text: 'Item 6' });
    this.selectedItems.push({ item_id: 6, item_text: 'Item 6' });
    setTimeout(() => {
      this.isShowMultiselect = false;
      this.isLoadingView();
    }, 100)
  }
  processFile($event: any) {
    const file = $event.target.files[0];

    // Verificar si el archivo es una imagen
    if (!file.type.startsWith('image/')) {
      this.toast.error('El archivo seleccionado no es una imagen', 'Error');
      return;
    }

    this.file_imagen = file;

    // Leer el archivo y convertirlo en una URL para la previsualización
    const reader = new FileReader();
    reader.onload = () => {
      this.imagen_previsualizacion = reader.result; // Actualiza la previsualización
      this.isLoadingView();
    };
    reader.readAsDataURL(file);
  }

  isLoadingView() {
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }

  changeDepartamento() {
    this.categorie_seconds_backups = this.categorie_seconds.filter(
      (item: any) => item.categorie_second_id == this.categorie_third_id
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
    if (!this.title || !this.file_imagen) {
      this.toast.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);

    formData.append('imagen', this.file_imagen);

    this.productService.createProducts(formData).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message === 403) {
        this.toast.error('No tiene permisos para crear categorias', 'Error');
        return;
      }

      (this.title = ''),
        (this.file_imagen = null),
        (this.imagen_previsualizacion =
          'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg'),
        this.toast.success('El producto creada exitosamente', 'Éxito');
    });
  }
}
