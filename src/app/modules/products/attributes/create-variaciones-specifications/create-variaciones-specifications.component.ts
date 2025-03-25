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
  styleUrls: ['./create-variaciones-specifications.component.scss'],
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

  attributes_specifications: any = [];
  properties: any = [];
  propertie_id: any = null;
  value_add: any = null;
  specifications: any = [];
  constructor(
    public attributeService: AttributesService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
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
    this.configAll();
    this.listSpecification();
  }

  configAll() {
    this.attributeService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.attributes_specifications = resp.attributes_specifications;
    });
  }
  showProduct() {
    this.attributeService
      .showProduct(this.PRODUCT_ID)
      .subscribe((resp: any) => {
        this.PRODUCT_SELECT = resp.product;
        this.title = resp.product.title;
        this.sku = resp.product.sku;
      });
  }

  listSpecification() {
    this.attributeService
      .listSpecification(this.PRODUCT_ID)
      .subscribe((resp: any) => {
        // console.log('API response:', resp);
        if (Array.isArray(resp)) {
          this.specifications = resp;
        } else if (resp.specifications) {
          this.specifications = resp.specifications;
        } else {
          const keys = Object.keys(resp);
          if (keys.length > 0 && Array.isArray(resp[keys[0]])) {
            this.specifications = resp[keys[0]];
          } else {
            this.specifications = [];
          }
        }
        // console.log('Specifications after assignment:', this.specifications);
      });
  }

  changeSpecifications() {
    this.propertie_id = null;
    this.value_add = null;
    this.selectedItemsTags = [];
    let ATTRIBUTE = this.attributes_specifications.find(
      (item: any) => item.id == this.specification_attribute_id
    );
    if (ATTRIBUTE) {
      this.type_attribute_specification = ATTRIBUTE.type_attribute;
      if (
        this.type_attribute_specification == 3 ||
        this.type_attribute_specification == 4
      ) {
        this.properties = ATTRIBUTE.properties;
        this.dropdownList = ATTRIBUTE.properties;
      } else {
        this.properties = [];
        this.dropdownList = [];
      }
    } else {
      this.type_attribute_specification = 0;
      this.properties = [];
      this.dropdownList = [];
    }
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
    if (
      this.type_attribute_specification == 4 &&
      this.selectedItemsTags.length == 0
    ) {
      this.toastr.error('Debes seleccionar al menos una opción');
      return;
    }
    if (this.selectedItemsTags.length > 0) {
      this.value_add = JSON.stringify(this.selectedItemsTags);
    }
    if (
      !this.specification_attribute_id ||
      (!this.propertie_id && !this.value_add)
    ) {
      this.toastr.error('Debes seleccionar una propiedad o ingresar un valor');
      return;
    }
    let data = {
      product_id: this.PRODUCT_ID,
      attribute_id: this.specification_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
    };

    this.attributeService.createSpecification(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error(
          'No tienes permisos para crear una nueva especificación',
          resp.message_text
        );
      } else {
        this.toastr.success('Especificación creada correctamente');

        // Find the attribute from our attributes_specifications array
        const attribute = this.attributes_specifications.find(
          (attr: any) => attr.id == this.specification_attribute_id
        );

        // Create a complete specification object with the attribute
        let newSpec = Array.isArray(resp.specification)
          ? resp.specification[0]
          : resp.specification;

        // Add the attribute to the specification
        newSpec.attribute = attribute || { name: 'Unknown' };

        // If there's a property ID, find the property from the attribute
        if (this.propertie_id && attribute && attribute.properties) {
          const property = attribute.properties.find(
            (prop: any) => prop.id == this.propertie_id
          );
          if (property) {
            newSpec.propertie = property;
          }
        }

        // Make sure value_add is set if that's what was used
        if (this.value_add) {
          newSpec.value_add = this.value_add;
        }

        // Add to the specifications array
        this.specifications.unshift(newSpec);

        // Reset form fields
        this.propertie_id = null;
        this.value_add = null;
        this.specification_attribute_id = '';
      }
    });
  }
  getValueAttribute(attribute_special: any) {
    if (attribute_special.propertie_id) {
      // Convert propertie_id to number for comparison
      const propertyId = Number(attribute_special.propertie_id);

      if (attribute_special.propertie) {
        return attribute_special.propertie.name;
      }
      const attribute = this.attributes_specifications.find(
        (attr: any) => attr.id == attribute_special.attribute_id
      );

      if (attribute && attribute.properties) {
        const property = attribute.properties.find(
          (prop: any) => Number(prop.id) === propertyId
        );

        if (property) {
          attribute_special.propertie = property;
          return property.name;
        }
      }

      return `Property ID: ${attribute_special.propertie_id}`;
    }

    if (attribute_special.value_add) {
      return attribute_special.value_add;
    }
  }
}
