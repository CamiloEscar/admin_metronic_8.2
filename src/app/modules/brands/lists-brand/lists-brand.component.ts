import { Component } from '@angular/core';
import { BrandService } from '../service/brand.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBrandComponent } from '../create-brand/create-brand.component';
import { EditBrandComponent } from '../edit-brand/edit-brand.component';
import { DeleteBrandComponent } from '../delete-brand/delete-brand.component';

@Component({
  selector: 'app-lists-brand',
  templateUrl: './lists-brand.component.html',
  styleUrls: ['./lists-brand.component.scss']
})
export class ListsBrandComponent {
brands: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public brandService: BrandService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listBrands();
    this.isLoading$ = this.brandService.isLoading$;
  }

  listBrands(page = 1) {
    this.brandService
      .listBrands(page, this.search)
      .subscribe((resp: any) => {
        console.log(resp);
        this.brands = resp.brands;
        this.totalPages = resp.total;
        this.currentPage = page;
      });
  }


  searchTo() {
    this.listBrands();
  }

  loadPage($event: any) {
    this.listBrands($event);
  }

  // In list-attribute.component.ts, modify your openModalCreateAttribute method:
  openModalCreateBrand() {
    const modalRef = this.modalService.open(CreateBrandComponent, {
      centered: true,
      size: 'md',
    });

    // Add this check to ensure the property exists before subscribing
    if (modalRef.componentInstance.BrandC) {
      modalRef.componentInstance.BrandC.subscribe((brand: any) => {

        this.brands.unshift(brand);
      });
    }
  }

  openModalEditBrand(brand: any) {
    const modalRef = this.modalService.open(EditBrandComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.brand = brand;

    // Add this check to ensure the property exists before subscribing
    if (modalRef.componentInstance.BrandE) {
      modalRef.componentInstance.BrandE.subscribe((brand: any) => {

        // this.brands.unshift(brand);
        let INDEX = this.brands.findIndex((item:any) =>
          item.id == brand.id
        );
        if (INDEX!== -1) {
          this.brands[INDEX] = brand;
        }
      });
    }
  }

  deleteBrand(brand: any) {
    const modalRef = this.modalService.open(DeleteBrandComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.brand = brand;

    modalRef.componentInstance.BrandD.subscribe((resp: any) => {
      let INDEX = this.brands.findIndex(
        (item: any) => item.id === brand.id
      );
      if (INDEX !== -1) {
        this.brands.splice(INDEX, 1);
      }
    });
  }
}
