import { Component } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { DeleteImagenAddComponent } from '../../edit-product/delete-imagen-add/delete-imagen-add.component';

@Component({
  selector: 'app-create-variaciones-specifications',
  templateUrl: './create-variaciones-specifications.component.html',
  styleUrls: ['./create-variaciones-specifications.component.scss']
})
export class CreateVariacionesSpecificationsComponent {
title: string = '';
  sku: string = '';

  isLoading$: any;

  specification_attribute_id: string = '';
  variations_attribute_id: string = '';
  type_attribute_specification: number = 1;
  type_attribute_variation: number = 3;
  attributes: any = [];


  dropdownList: any = [];
  selectedItemsTags: any = []; //campo_4
  dropdownSettings: IDropdownSettings = {};
  word: string = '';

  isShowMultiselect: boolean = false;
  PRODUCT_ID: string = '';
  PRODUCT_SELECT: any;


  campo_1: string = '';
  campo_2: number = 0;
  campo_3: any;

  campo_3_variation: any;

  dropdownListVariation: any = []; //campo_3_variation;camp
  selectedItemsTagsVariation: any = []; //campo_4_variation

  precio_add: number = 0;
  stock_add: number = 0;

  constructor(
    public attributeService: AttributesService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    public modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
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

    this.showProduct();
  }

  showProduct() {
    this.attributeService.showProduct(this.PRODUCT_ID).subscribe((resp: any) => {
      this.PRODUCT_SELECT = resp.product;
      this.title = resp.product.title;
      this.sku = resp.product.sku;
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

  isLoadingView() {
    this.attributeService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.attributeService.isLoadingSubject.next(false);
    }, 50);
  }


  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  save() {

  }
}
