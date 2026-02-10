import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteImagenAddComponent } from './delete-imagen-add/delete-imagen-add.component';
import { ProductStockMovementService } from '../service/product-stock-movement.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ProductSalesHistoryService } from '../service/product-sales-history.service';

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
  state: number = 1;
  cost: number = 1;
  stock: number = 0;

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

  imagen_add: any;
  imagen_add_previsualiza: any =
  'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  images_files: any = [];

    // MOVIMIENTOS DE STOCK
  stock_movements: any = [];
  stock_summary: any = null;

  // Formulario de movimiento de stock
  movement_type: string = 'ingreso';
  movement_quantity: number = 0;
  movement_description: string = '';
  movement_reference: string = '';

  showStockSection: boolean = false;

  // HISTORIAL DE VENTAS
  sales_history: any = [];
  sales_summary: any = null;
  showSalesSection: boolean = false;
  salesCurrentPage: number = 1;
  salesTotalPages: number = 0;
  URL_SERVICIOS: any = URL_SERVICIOS;
  sale: any = ''
  constructor(
    public productService: ProductService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public modalService: NgbModal,
    public stockMovementService: ProductStockMovementService,
    public salesHistoryService: ProductSalesHistoryService,

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
      // //console.log(resp);
      this.PRODUCT_ID = resp.id;
    });
    this.configAll();
  }

  configAll() {
    this.productService.configAll().subscribe((resp: any) => {
      // //console.log(resp);
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
      this.state = resp.product.state;
      this.cost = resp.product.cost;
      this.stock = resp.product.stock;
      this.imagen_previsualizacion = resp.product.imagen;
      this.marca_id = resp.product.brand_id;
      this.categorie_first_id = resp.product.categorie_first_id;
      this.categorie_second_id = resp.product.categorie_second_id;
      this.categorie_third_id = resp.product.categorie_third_id;
      this.selectedItemsTags = resp.product.selectedItemsTags;
      this.images_files = resp.product.images;

      this.changeDepartamento();
      this.changeCategorie();

      this.dropdownList = resp.product.tags;
      this.selectedItemsTags = resp.product.tags;

      // CARGAR MOVIMIENTOS DE STOCK
      this.loadStockMovements();
      this.loadStockSummary();

      // CARGAR HISTORIAL DE VENTAS
      this.loadSalesHistory();
      this.loadSalesSummary();

    });
  }

  // ✨ NUEVOS MÉTODOS PARA GESTIONAR STOCK

  loadStockMovements() {
    this.stockMovementService.listMovements(this.PRODUCT_ID).subscribe((resp: any) => {
      this.stock_movements = resp.movements || [];
    });
  }

  loadStockSummary() {
    this.stockMovementService.getSummary(this.PRODUCT_ID).subscribe((resp: any) => {
      this.stock_summary = resp;
    });
  }

  toggleStockSection() {
    this.showStockSection = !this.showStockSection;
  }

  addStockMovement() {
    if (!this.movement_quantity || this.movement_quantity <= 0) {
      this.toastr.error('Debe ingresar una cantidad válida', 'Error');
      return;
    }

    if (this.movement_type === 'egreso' && this.movement_quantity > this.stock) {
      this.toastr.error('No hay suficiente stock disponible', 'Error');
      return;
    }

    let data = {
      product_id: this.PRODUCT_ID,
      type: this.movement_type,
      quantity: this.movement_quantity,
      description: this.movement_description,
      reference: this.movement_reference,
    };

    this.stockMovementService.createMovement(data).subscribe(
      (resp: any) => {
        if (resp.message === 200) {
          this.toastr.success(resp.message_text, 'Éxito');

          // Actualizar el stock actual del producto
          this.stock = resp.product_stock;

          // Agregar el nuevo movimiento al inicio de la lista
          this.stock_movements.unshift(resp.movement);

          // Recargar el resumen
          this.loadStockSummary();

          // Limpiar el formulario
          this.movement_quantity = 0;
          this.movement_description = '';
          this.movement_reference = '';
          this.movement_type = 'ingreso';
        } else {
          this.toastr.error(resp.message_text, 'Error');
        }
      },
      (error) => {
        this.toastr.error('Error al registrar el movimiento', 'Error');
      }
    );
  }

  deleteStockMovement(movement: any) {
    if (!confirm('¿Está seguro de eliminar este movimiento? Solo se puede eliminar el último movimiento registrado.')) {
      return;
    }

    this.stockMovementService.deleteMovement(movement.id).subscribe(
      (resp: any) => {
        if (resp.message === 200) {
          this.toastr.success(resp.message_text, 'Éxito');

          // Eliminar el movimiento de la lista
          let INDEX = this.stock_movements.findIndex((item: any) => item.id === movement.id);
          if (INDEX !== -1) {
            this.stock_movements.splice(INDEX, 1);
          }

          // Recargar datos
          this.showProduct();
        } else {
          this.toastr.error(resp.message_text, 'Error');
        }
      },
      (error) => {
        this.toastr.error(error.error.message_text || 'Error al eliminar el movimiento', 'Error');
      }
    );
  }

  getMovementTypeLabel(type: string): string {
    const types: any = {
      'ingreso': 'Ingreso',
      'egreso': 'Egreso',
      'ajuste': 'Ajuste'
    };
    return types[type] || type;
  }

  getMovementTypeBadgeClass(type: string): string {
    const classes: any = {
      'ingreso': 'badge-success',
      'egreso': 'badge-danger',
      'ajuste': 'badge-warning'
    };
    return classes[type] || 'badge-secondary';
  }

loadSalesHistory(page: number = 1) {
  this.salesHistoryService.getProductSalesHistory(this.PRODUCT_ID, page).subscribe(
    (resp: any) => {
      // console.log(resp.sales);
      this.sales_history = (resp.sales || []).map((sale: any) => ({
        ...sale,
        shipping_status: sale.shipping_status ?? 'pending'
      }));

      this.salesTotalPages = resp.total || 0;
      this.salesCurrentPage = page;
    },
    (error) => {
      console.error('Error al cargar historial de ventas:', error);
    }
  );
}


  loadSalesSummary() {
    this.salesHistoryService.getProductSalesSummary(this.PRODUCT_ID).subscribe(
      (resp: any) => {
        this.sales_summary = resp;
      },
      (error) => {
        console.error('Error al cargar resumen de ventas:', error);
      }
    );
  }

  toggleSalesSection() {
    this.showSalesSection = !this.showSalesSection;
    if (this.showSalesSection && this.sales_history.length === 0) {
      this.loadSalesHistory();
    }
  }

  loadSalesPage(page: number) {
    this.loadSalesHistory(page);
  }

  getPaymentMethodLabel(method: string): string {
    const methods: any = {
      'MERCADOPAGO': 'Mercado Pago',
      'TRANSFERENCIA': 'Transferencia',
      'EFECTIVO': 'Efectivo',
      'TARJETA': 'Tarjeta',
    };
    return methods[method] || method;
  }

  getPaymentMethodBadgeClass(method: string): string {
    const classes: any = {
      'MERCADOPAGO': 'badge-primary',
      'TRANSFERENCIA': 'badge-info',
      'EFECTIVO': 'badge-success',
      'TARJETA': 'badge-warning',
    };
    return classes[method] || 'badge-secondary';
  }

  updateShippingStatus(sale: any) {
  this.salesHistoryService
    .updateShippingStatus(sale.id, sale.shipping_status)
    .subscribe(
      (resp: any) => {
        if (resp.message === 200) {
          this.toastr.success('Estado actualizado', 'Éxito');
        }
      },
      (error) => {
        this.toastr.error('Error al actualizar el estado', 'Error');
      }
    );
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
    // console.log(this.file_imagen);

    // Leer el archivo y convertirlo en una URL para la previsualización
    const reader = new FileReader();
    reader.onload = () => {
      this.imagen_previsualizacion = reader.result; // Actualiza la previsualización
      this.isLoadingView();
    };
    reader.readAsDataURL(file);
  }

  processFileTwo($event: any) {
    const file = $event.target.files[0];

    // Verificar si el archivo es una imagen
    if (!file.type.startsWith('image/')) {
      this.toastr.error('El archivo seleccionado no es una imagen', 'Error');
      return;
    }

    this.imagen_add = file;
    // console.log(this.imagen_add);

    // Leer el archivo y convertirlo en una URL para la previsualización
    const reader = new FileReader();
    reader.onload = () => {
      this.imagen_add_previsualiza = reader.result; // Actualiza la previsualización
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

  removeImages(id:number) {
     const modalRef = this.modalService.open(DeleteImagenAddComponent, {
          centered: true,
          size: 'md',
        });
        modalRef.componentInstance.id = id;

        modalRef.componentInstance.ImagenD.subscribe((resp: any) => {
          let INDEX = this.images_files.findIndex(
            (item: any) => item.id === id
          );
          if (INDEX !== -1) {
            this.images_files.splice(INDEX, 1);
          }
        });
      }

  addImagen() {
    if(!this.imagen_add) {
      this.toastr.error('Debe seleccionar una imagen', 'Error');
      return;
    }

    let formData = new FormData();
    formData.append('imagen_add', this.imagen_add);
    formData.append('product_id', this.PRODUCT_ID);
    this.productService.imagenAdd(formData).subscribe((resp: any) => {
      // //console.log(resp);
      this.toastr.success('Imagen agregada exitosamente', 'Éxito');
      this.images_files.unshift(resp.imagen)
      this.imagen_add = null;
      this.imagen_add_previsualiza = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
    });
  }

  onItemSelect(item: any) {
    // console.log(item);
  }
  onSelectAll(items: any) {
    // console.log(items);
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
    !this.cost ||
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
  formData.append('stock', this.stock + '');

  if (this.file_imagen) {
    formData.append('portada', this.file_imagen);
  }

  formData.append('categorie_first_id', this.categorie_first_id);

  if (this.categorie_second_id !== null && this.categorie_second_id !== undefined) {
    formData.append('categorie_second_id', this.categorie_second_id);
  }
  if (this.categorie_third_id !== null && this.categorie_third_id !== undefined) {
    formData.append('categorie_third_id', this.categorie_third_id);
  }

  formData.append('description', this.description);
  formData.append('resumen', this.resumen);
  formData.append('multiselect', JSON.stringify(this.selectedItemsTags));
  formData.append('state', this.state + '');
  formData.append('cost', Number(this.cost) + '');

  this.productService.updateProducts(formData, this.PRODUCT_ID).subscribe({
    next: (resp: any) => {
      if (resp.message === 403) {
        this.toastr.error('No tiene permisos para editar productos', 'Error');
        return;
      }

      this.file_imagen = null;
      this.toastr.success('El producto se editó exitosamente', 'Éxito');

      setTimeout(() => {
        this.router.navigate(['/products/list']);
      }, 1000);
    },
    error: (error: any) => {
      this.toastr.error('Error al actualizar el producto', 'Error');
    }
  });
}

getShippingStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'preparing':
      return 'Preparando';
    case 'shipped':
      return 'Enviado';
    case 'delivered':
      return 'Entregado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Sin estado';
  }
}

getShippingBadgeClass(status: string): string {
  switch (status) {
    case 'pending':
      return 'badge-light-warning';
    case 'preparing':
      return 'badge-light-info';
    case 'shipped':
      return 'badge-light-primary';
    case 'delivered':
      return 'badge-light-success';
    case 'cancelled':
      return 'badge-light-danger';
    default:
      return 'badge-light-secondary';
  }
}

}
