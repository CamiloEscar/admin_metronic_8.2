import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent {
  products: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public productsService: ProductService,
    public modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listProducts();
    this.isLoading$ = this.productsService.isLoading$;
  }

  listProducts(page = 1) {
    this.productsService
      .listProducts(page, this.search)
      .subscribe((resp: any) => {
        // console.log(resp);
        this.products = resp.products.data;
        this.totalPages = resp.total;
        this.currentPage = page;
      }, (err:any) => {
        console.log(err);
        this.toastr.error(err.error.message, 'API RESPONSE . ver error comunicarse');
      });
  }

  searchTo() {
    this.listProducts();
  }

  loadPage($event: any) {
    this.listProducts($event);
  }
  deleteProduct(product: any) {
    const modalRef = this.modalService.open(DeleteProductComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.product = product;

    modalRef.componentInstance.ProductD.subscribe((resp: any) => {
      let INDEX = this.products.findIndex(
        (item: any) => item.id === product.id
      );
      if (INDEX !== -1) {
        this.products.splice(INDEX, 1);
      }
    });
  }
}
