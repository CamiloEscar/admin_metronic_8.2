import { Component } from '@angular/core';
import { DeleteAttributeComponent } from '../delete-attribute/delete-attribute.component';
import { AttributesService } from '../service/attributes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-attribute',
  templateUrl: './list-attribute.component.html',
  styleUrls: ['./list-attribute.component.scss'],
})
export class ListAttributeComponent {
  attributes: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public attributesService: AttributesService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.listAttributes();
    this.isLoading$ = this.attributesService.isLoading$;
  }

  listAttributes(page = 1) {
    this.attributesService
      .listAttributes(page, this.search)
      .subscribe((resp: any) => {
        console.log(resp);
        this.attributes = resp.attributes.data;
        this.totalPages = resp.total;
        this.currentPage = page;
      });
  }



  getNameAttribute(type_attribute: number) {
    var name_attribute = '';
    switch (type_attribute) {
      case 1:
        name_attribute = 'Texto';
        break;
      case 2:
        name_attribute = 'Numero';
        break;
      case 3:
        name_attribute = 'Seleccionable';
        break;
      case 4:
        name_attribute = 'Seleccionable Multiple';
        break;
      default:
        break;
    }
    return name_attribute;
  }



  searchTo() {
    this.listAttributes();
  }

  loadPage($event: any) {
    this.listAttributes($event);
  }

  openModalCreateAttribute() {}

  openModalEditAttribute(attribute:any) {

  }

  deleteAttribute(attribute: any) {
    const modalRef = this.modalService.open(DeleteAttributeComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.attribute = attribute;

    // modalRef.componentInstance.attributeD.subscribe((resp: any) => {
    //   let INDEX = this.attributes.findIndex(
    //     (item: any) => item.id === attribute.id
    //   );
    //   if (INDEX !== -1) {
    //     this.attributes.splice(INDEX, 1);
    //   }
    // });
  }
}
