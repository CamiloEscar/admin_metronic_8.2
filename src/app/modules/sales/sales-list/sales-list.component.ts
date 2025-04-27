import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../service/sales.service';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent {
sales: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  // variables de filtros
  marcas: any = [];
  marca_id: string = '';
  categorie_first_id: any = [];
  categorie_second_id: any = [];
  categorie_third_id: any = [];
  categorie_first: any = [];
  categorie_seconds: any = [];
  categorie_thirds: any = [];
  categorie_seconds_backups: any = [];
  categorie_thirds_backups: any = [];

  constructor(
    public salesService: SalesService,
    public modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listSales();
    this.isLoading$ = this.salesService.isLoading$;
    this.configAll();
  }
  configAll(){
    this.salesService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.marcas = resp.brands;
      this.categorie_first = resp.categories_first;
      this.categorie_seconds = resp.categories_seconds;
      this.categorie_thirds = resp.categories_thirds;
    })
  }

  listSales(page = 1){
    let data = {
      search: this.search,
      brand_id: this.marca_id,
      categorie_first_id: this.categorie_first_id,
      categorie_second_id: this.categorie_second_id,
      categorie_third_id: this.categorie_third_id,
    }
    this.salesService.listSales(page,data).subscribe((resp:any) => {
      console.log(resp);
      this.sales = resp.sales.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    },(err:any) => {
      console.log(err);
      this.toastr.error("API RESPONSE - COMUNIQUESE CON EL DESARROLLADOR",err.error.message);
    })
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


  searchTo() {
    this.listSales();
  }

  loadPage($event: any) {
    this.listSales($event);
  }
}
