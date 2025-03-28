import { Component } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { EditVariacionesSpecificationsComponent } from '../edit-variaciones-specifications/edit-variaciones-specifications.component';
import { DeleteVariacionesSpecificationsComponent } from '../delete-variaciones-specifications/delete-variaciones-specifications.component';
import { CreateAnidadoVariacionesComponent } from '../create-anidado-variaciones/create-anidado-variaciones.component';

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
  attributes_variations: any = [];
  properties: any = [];
  propertie_id: any = null;
  value_add: any = null;
  specifications: any = [];
  variations: any = [];
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
    this.listVariations();
    // console.log('Attributes:', this.attributes);
    // console.log('Attribute Specifications:', this.attributes_specifications);
  }

  configAll() {
    this.attributeService.configAll().subscribe((resp: any) => {
      console.log('Full Response:', resp);

      // Populate attributes_specifications
      this.attributes_specifications = resp.attributes_specifications || [];

      this.attributes_variations = resp.attributes_variations || [];

      // Populate attributes from attributes_variations
      this.attributes = resp.attributes_variations || [];

      console.log('Attributes:', this.attributes);
      console.log('Attribute Specifications:', this.attributes_specifications);
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

  getAttributeName(attributeId: any): string {
    if (!attributeId) return 'Desconocido';

    const attribute = this.attributes_specifications.find(
      (attr: any) => attr.id === Number(attributeId)
    );
    return attribute ? attribute.name : 'Desconocido';
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
  listVariations() {
    this.attributeService
      .listVariations(this.PRODUCT_ID)
      .subscribe((resp: any) => {
        // console.log('API response:', resp);
        if (Array.isArray(resp)) {
          this.variations = resp;
        } else if (resp.variation) {
          this.variations = resp.variations;
        } else {
          const keys = Object.keys(resp);
          if (keys.length > 0 && Array.isArray(resp[keys[0]])) {
            this.variations = resp[keys[0]];
          } else {
            this.variations = [];
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
        this.properties = ATTRIBUTE.properties || [];
        this.dropdownList = ATTRIBUTE.properties || [];

        this.propertie_id = '';
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

  changeVariations() {
    this.propertie_id = null;
    this.value_add = null;
    let ATTRIBUTE = this.attributes_variations.find(
      (item: any) => item.id == this.variations_attribute_id
    );
    if (ATTRIBUTE) {
      this.type_attribute_variation = ATTRIBUTE.type_attribute;
      if (
        this.type_attribute_variation == 3 ||
        this.type_attribute_variation == 4
      ) {
        this.properties = ATTRIBUTE.properties || [];

        this.propertie_id = '';
      } else {
        this.properties = [];
      }
    } else {
      this.type_attribute_variation = 0;
      this.properties = [];
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

  editSpecification(specification: any) {
    console.log('Editing specification:', specification);

    const modal = this.modalService.open(
      EditVariacionesSpecificationsComponent,
      { centered: true, size: 'md' }
    );
    modal.componentInstance.specification = { ...specification }; // Crea una copia
    modal.componentInstance.attributes_specifications =
      this.attributes_specifications;

    modal.componentInstance.EspecificacionE.subscribe((edit: any) => {
      console.log('Updated specification:', edit);

      if (edit && edit.specification) {
        let updatedSpec = Array.isArray(edit.specification)
          ? edit.specification[0]
          : edit.specification;

        // Encuentra el atributo correspondiente
        const attribute = this.attributes_specifications.find(
          (attr: any) => attr.id == updatedSpec.attribute_id
        );

        if (attribute) {
          updatedSpec.attribute = attribute;

          // Si hay un propertie_id, encuentra la propiedad correspondiente
          if (updatedSpec.propertie_id && attribute.properties) {
            const property = attribute.properties.find(
              (prop: any) =>
                Number(prop.id) === Number(updatedSpec.propertie_id)
            );

            if (property) {
              updatedSpec.propertie = property;
            }
          }
        }

        // Encuentra el índice de la especificación en el array
        const index = this.specifications.findIndex(
          (s: any) => s.id === specification.id
        );
        if (index !== -1) {
          // Actualiza la especificación en el array
          this.specifications[index] = updatedSpec;
        }
      }
    });
  }
  deleteSpecification(specification: any) {
    const modal = this.modalService.open(
      DeleteVariacionesSpecificationsComponent,
      { centered: true, size: 'md' }
    );
    modal.componentInstance.specification = specification;

    modal.componentInstance.SpecificationD.subscribe((edit: any) => {
      console.log(edit);
      let INDEX = this.specifications.findIndex(
        (item: any) => item.id == specification.id
      );
      if (INDEX != -1) {
        this.specifications.splice(INDEX, 1);
      }
    });
  }
  getValueAttribute(attribute_special: any) {
    // Para propiedades seleccionables (type 3)
    if (attribute_special.propertie_id) {
      // Si ya tenemos el objeto propertie con el nombre, úsalo
      if (attribute_special.propertie && attribute_special.propertie.name) {
        return attribute_special.propertie.name;
      }

      // Busca el atributo correspondiente
      const attribute = this.attributes_specifications.find(
        (attr: any) => attr.id == attribute_special.attribute_id
      );

      // Si el atributo tiene propiedades, busca la propiedad por ID
      if (attribute && attribute.properties) {
        const property = attribute.properties.find(
          (prop: any) =>
            Number(prop.id) === Number(attribute_special.propertie_id)
        );

        if (property) {
          // Guarda la propiedad en el objeto para futuras referencias
          attribute_special.propertie = property;
          return property.name;
        }
      }

      return `Propiedad ID: ${attribute_special.propertie_id}`;
    }

    // Para valores múltiples (type 4)
    if (
      attribute_special.value_add &&
      attribute_special.attribute &&
      attribute_special.attribute.type_attribute === 4
    ) {
      try {
        const values = JSON.parse(attribute_special.value_add);
        if (Array.isArray(values)) {
          // Busca el atributo correspondiente
          const attribute = this.attributes_specifications.find(
            (attr: any) => attr.id == attribute_special.attribute_id
          );

          if (attribute && attribute.properties) {
            // Mapea los IDs a nombres de propiedades
            const propertyNames = values.map((val) => {
              const propId = typeof val === 'object' ? val.id : val;
              const property = attribute.properties.find(
                (prop: any) => Number(prop.id) === Number(propId)
              );
              return property ? property.name : `ID: ${propId}`;
            });

            return propertyNames.join(', ');
          }

          return attribute_special.value_add;
        }
      } catch (e) {
        console.error('Error parsing value_add:', e);
      }
    }

    // Para valores simples (type 1, 2)
    if (attribute_special.value_add) {
      return attribute_special.value_add;
    }

    return 'Desconocido';
  }
  saveVariation() {
    if (
      !this.variations_attribute_id ||
      (!this.propertie_id && !this.value_add)
    ) {
      this.toastr.error('Debes seleccionar una propiedad o ingresar un valor');
      return;
    }

    if (this.precio_add < 0) {
      this.toastr.error('El precio de agregado no puede ser negativo');
      return;
    }
    if (this.stock_add < 0) {
      this.toastr.error('El stock no puede ser negativo');
      return;
    }
    let data = {
      product_id: this.PRODUCT_ID,
      attribute_id: this.variations_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
      add_price: this.precio_add,
      stock: this.stock_add,
    };

    this.attributeService.createVariation(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error(
          'No tienes permisos para crear una nueva especificación',
          resp.message_text
        );
      } else {
        this.toastr.success('Especificación creada correctamente');
        this.variations.unshift(resp.variation);
        this.propertie_id = null;
        this.value_add = null;
        this.variations_attribute_id = '';
        this.precio_add = 0;
        this.stock_add = 0;

        // Find the attribute from our attributes_specifications array
        const attribute = this.attributes_specifications.find(
          (attr: any) => attr.id == this.variations_attribute_id
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
        this.variations.unshift(newSpec);

        // Reset form fields
        this.propertie_id = null;
        this.value_add = null;
        this.variations_attribute_id = '';
      }
    });
  }

  editVariation(variation: any) {
    const modal = this.modalService.open(
      EditVariacionesSpecificationsComponent,
      { centered: true, size: 'md' }
    );

    // Make a deep copy of the variation to avoid reference issues
    modal.componentInstance.specification = JSON.parse(JSON.stringify(variation));
    modal.componentInstance.attributes_specifications = this.attributes_specifications;
    modal.componentInstance.attributes_variations = this.attributes_variations;
    modal.componentInstance.is_variation = 1;

    modal.componentInstance.EspecificacionE.subscribe((edit: any) => {
      console.log('Updated variation from modal:', edit);

      if (edit && edit.specification) {
        // Get the updated specification from the event
        const updatedSpec = edit.specification;

        // Find the index of the variation in the array
        const index = this.variations.findIndex(
          (v: any) => v.id === variation.id
        );

        if (index !== -1) {
          // Replace the old variation with the updated one
          this.variations[index] = updatedSpec;

          // Force Angular change detection by creating a new array reference
          this.variations = [...this.variations];
        }
      }
    });
  }

  deleteVariation(variation: any) {
    const modal = this.modalService.open(
      DeleteVariacionesSpecificationsComponent,
      { centered: true, size: 'md' }
    );

    modal.componentInstance.specification = variation;
    modal.componentInstance.is_variation = 1;
    modal.componentInstance.SpecificationD.subscribe((edit: any) => {
      console.log(edit);
      let INDEX = this.variations.findIndex(
        (item: any) => item.id == variation.id
      );
      if (INDEX != -1) {
        this.variations.splice(INDEX, 1);
      }
    });
  }

  openAnidado(variation:any){
    const modal = this.modalService.open(
      CreateAnidadoVariacionesComponent,
      { centered: true, size: 'lg' }
    );
    modal.componentInstance.variation = variation;
    modal.componentInstance.attributes_variations = this.attributes_variations;
  }
}
