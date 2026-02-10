import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../service/sales.service';
import { URL_SERVICIOS } from 'src/app/config/config';

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
  categorie_first_id: string = '';
  categorie_second_id: string = '';
  categorie_third_id: string = '';
  categorie_first: any = [];
  categorie_seconds: any = [];
  categorie_thirds: any = [];
  categorie_seconds_backups: any = [];
  categorie_thirds_backups: any = [];

  start_date: any;
  end_date: any;
  method_payment: any;

  URL_SERVICIOST:any = URL_SERVICIOS
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
      //console.log(resp);
      this.marcas = resp.brands;
      this.categorie_first = resp.categorie_first;
      this.categorie_seconds = resp.categorie_seconds;
      this.categorie_thirds = resp.categorie_thirds;
    })
  }

  listSales(page = 1){
    let data = {
      search: this.search,
      brand_id: this.marca_id,
      categorie_first_id: this.categorie_first_id,
      categorie_second_id: this.categorie_second_id,
      categorie_third_id: this.categorie_third_id,
      start_date: this.start_date,
      end_date: this.end_date,
      method_payment: this.method_payment,
    }
    this.salesService.listSales(page,data).subscribe((resp:any) => {
      console.log(resp);
      this.sales = resp.sale.data;
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

  reset() {
  this.search = '';
  this.marca_id = '';
  this.categorie_first_id = '';
  this.categorie_second_id = '';
  this.categorie_third_id = '';
  this.start_date = null;
  this.end_date = null;
  this.method_payment = '';
  this.listSales();
  }

  export_sale_download(){

    let LINK = '';
    if(this.search){
      LINK += '&search='+this.search;
    }
    if(this.marca_id){
      LINK += '&brand_id='+this.marca_id;
    }
    if(this.categorie_first_id){
      LINK += '&categorie_first_id='+this.categorie_first_id;
    }
    if(this.categorie_second_id){
      LINK += '&categorie_second_id='+this.categorie_second_id;
    }
    if(this.categorie_third_id){
      LINK += '&categorie_third_id='+this.categorie_third_id;
    }
    if(this.start_date){
      LINK += '&start_date='+this.start_date;
    }
    if(this.end_date){
      LINK += '&end_date='+this.end_date;
    }
    if(this.method_payment){
      LINK += '&method_payment='+this.method_payment;
    }

    window.open(URL_SERVICIOS+'/sales/list-excel?k=1'+LINK, '_blank');
  }
}
