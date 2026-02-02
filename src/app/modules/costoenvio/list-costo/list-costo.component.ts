import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CostosenvioService } from '../service/costoenvio.service';
import { DeleteCostoComponent } from '../delete-costo/delete-costo.component';

@Component({
  selector: 'app-list-costo',
  templateUrl: './list-costo.component.html',
  styleUrls: ['./list-costo.component.scss']
})
export class ListCostoComponent {
costos: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public costoService: CostosenvioService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listCostos();
    this.isLoading$ = this.costoService.isLoading$;
  }

  listCostos(page = 1) {
    this.costoService.listCostos(page, this.search).subscribe((resp: any) => {
      //console.log(resp);
      this.costos = resp.costos.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  searchTo() {
    this.listCostos();
  }

  loadPage($event: any) {
    this.listCostos($event);
  }

  getNameTypeCosto(type_cupone: number) {
    let NAME = '';
    switch (type_cupone) {
      case 1:
        NAME = 'Productos';
        break;
      case 2:
        NAME = 'Categorias';
        break;
      case 3:
        NAME = 'Marcas';
        break;

      default:
        break;
    }
    return NAME;
  }

  deleteCosto(costo: any) {
      const modalRef = this.modalService.open(DeleteCostoComponent, {
        centered: true,
        size: 'md',
      });
      modalRef.componentInstance.costo = costo;

      modalRef.componentInstance.CostoD.subscribe((resp: any) => {
        let INDEX = this.costos.findIndex(
          (item: any) => item.id === costo.id
        );
        if (INDEX !== -1) {
          this.costos.splice(INDEX, 1);
        }
      });
    }
}
