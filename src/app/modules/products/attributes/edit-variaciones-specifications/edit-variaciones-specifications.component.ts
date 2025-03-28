import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-edit-variaciones-specifications',
  templateUrl: './edit-variaciones-specifications.component.html',
  styleUrls: ['./edit-variaciones-specifications.component.scss'],
})
export class EditVariacionesSpecificationsComponent {
  @Output() EspecificacionE: EventEmitter<any> = new EventEmitter();

  @Input() specification: any;
  @Input() attributes_specifications: any = [];
  @Input() attributes_variations: any = [];
  @Input() is_variation: any; //cuando es false es una edicion para la especificacion, y si es true es una edicion para la variacion

  isLoading$: any;
  specification_attribute_id: string = '';
  variations_attribute_id: string = '';
  type_attribute_specification: number = 1;
  type_attribute_variation: number = 3;
  attributes: any = [];
  dropdownList: any = [];
  selectedItemsTags: any = []; //campo_4
  dropdownSettings: IDropdownSettings = {};

  properties: any = [];
  propertie_id: any = null;
  value_add: any = null;
  specifications: any = [];

  precio_add: any = 0;
  stock_add: any = 0;
  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };

    // Asegúrate de que specification_attribute_id se inicialice correctamente
    if (!this.is_variation) {
      this.specification_attribute_id = this.specification.attribute_id;
      // Llama a changeSpecifications para configurar todo correctamente
      this.changeSpecifications();
    } else {
      this.variations_attribute_id = this.specification.attribute_id;
      this.changeVariations();
    }

    if (this.is_variation) {
      this.precio_add = this.specification.add_price;
      this.stock_add = this.specification.stock;
    }
    // Si hay un propertie_id en la especificación, guárdalo
    if (this.specification.propertie_id) {
      this.propertie_id = this.specification.propertie_id;
    }
  }

  store() {
    if (!this.is_variation) {
      this.storeSpecification();
    } else {
      this.storeVariation();
    }
  }

  storeSpecification() {
    if (
      this.type_attribute_specification == 4 &&
      this.selectedItemsTags.length == 0
    ) {
      this.toastr.error('Debes seleccionar al menos una opción');
      return;
    }
    if (this.selectedItemsTags.length > 0) {
      // Sort the items by ID to ensure consistent JSON format
      this.selectedItemsTags.sort((a:any, b:any) => a.id - b.id);
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
      product_id: this.specification.product_id,
      attribute_id: this.specification_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
    };
    this.attributeService
      .updateSpecification(this.specification.id, data)
      .subscribe((resp: any) => {
        console.log('Response:', resp);

        if (resp.message == 403) {
          this.toastr.error('No tienes permisos para crear una nueva especificación',resp.message_text);
        } else {
          this.toastr.success('Especificación actualizada correctamente');

          // Encuentra el atributo actualizado
          const attribute = this.attributes_specifications.find(
            (attr: any) => attr.id == this.specification_attribute_id
          );

          // Crea un objeto de especificación completo
          let newSpec = Array.isArray(resp.specification)
            ? resp.specification[0]
            : resp.specification;

          // Añade el atributo a la especificación
          if (attribute) {
            newSpec.attribute = attribute;
          }

          // Si hay un propertie_id, encuentra la propiedad del atributo
          if (this.propertie_id && attribute && attribute.properties) {
            const property = attribute.properties.find(
              (prop: any) => Number(prop.id) === Number(this.propertie_id)
            );
            if (property) {
              newSpec.propertie = property;
            }
          }

          if (this.value_add) {
            newSpec.value_add = this.value_add;
          }

          // Asegúrate de que propertie_id esté establecido si se usó
          if (this.propertie_id) {
            newSpec.propertie_id = this.propertie_id;
          }

          this.EspecificacionE.emit({ specification: newSpec });
          this.modal.close();
        }
      });
  }

  storeVariation() {
    if(!this.variations_attribute_id || (!this.propertie_id && !this.value_add)){
      this.toastr.error('Debes seleccionar una propiedad o ingresar un valor');
      return;
    }

    // Find the selected attribute and property BEFORE making the API call
    const selectedAttribute = this.attributes_variations.find(
      (attr: any) => Number(attr.id) === Number(this.variations_attribute_id)
    );

    let selectedProperty:any = null;
    if (this.propertie_id && selectedAttribute && selectedAttribute.properties) {
      selectedProperty = selectedAttribute.properties.find(
        (prop: any) => Number(prop.id) === Number(this.propertie_id)
      );
    }

    let data = {
      product_id: this.specification.product_id,
      attribute_id: this.variations_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
      add_price: this.precio_add,
      stock: this.stock_add
    };

    this.attributeService.updateVariation(this.specification.id, data)
      .subscribe({
        next: (resp: any) => {
          console.log('Respuesta completa:', resp);

          if (resp.message !== 200) {
            this.toastr.error('Error al actualizar la variación', resp.message_text);
            return;
          }

          // Get the variation from the response
          const variation = resp.variation && resp.variation.length > 0
            ? resp.variation[0]
            : null;

          if (!variation) {
            this.toastr.error('No se encontró la variación');
            return;
          }

          // Create a complete updated specification with all necessary data
          const newSpec = {
            ...variation,
            id: this.specification.id,  // Ensure ID is preserved
            product_id: this.specification.product_id,
            attribute_id: this.variations_attribute_id,
            attribute: selectedAttribute || {},
            propertie_id: this.propertie_id,
            // Include the complete property object with its name
            propertie: selectedProperty || null,
            value_add: this.value_add,
            add_price: this.precio_add,
            stock: this.stock_add
          };

          console.log('Updated specification with property:', newSpec);

          // Emit the updated specification
          this.EspecificacionE.emit({ specification: newSpec });

          // Close the modal
          this.toastr.success('Variación actualizada correctamente');
          this.modal.close();
        },
        error: (error) => {
          console.error('Error en la actualización:', error);
          this.toastr.error('Ocurrió un error al actualizar, no puede tener el mismo valor');
        }
      });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  isLoadingView() {
    this.attributeService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.attributeService.isLoadingSubject.next(false);
    }, 50);
  }

  changeSpecifications() {
    this.value_add = null;
    this.selectedItemsTags = [];

    // Busca el atributo correcto por ID
    let ATTRIBUTE = this.attributes_specifications.find(
      (item: any) => item.id === Number(this.specification.attribute_id)
    );

    console.log('FOUND ATTRIBUTE:', ATTRIBUTE);
    console.log('SPECIFICATION:', this.specification);

    if (ATTRIBUTE) {
      this.specification.attribute = ATTRIBUTE;
      this.type_attribute_specification = ATTRIBUTE.type_attribute;
      this.specification_attribute_id = this.specification.attribute_id;
      if (
        this.type_attribute_specification == 3 ||
        this.type_attribute_specification == 4
      ) {
        this.properties = ATTRIBUTE.properties || [];
        this.dropdownList = ATTRIBUTE.properties || [];

        if (!this.propertie_id && this.specification.propertie_id) {
          this.propertie_id = this.specification.propertie_id;
        }

        if (this.specification.value_add) {
          try {
            let savedTags =
              typeof this.specification.value_add === 'string'
                ? JSON.parse(this.specification.value_add)
                : this.specification.value_add;

            // Para atributos de selección única
            if (this.type_attribute_specification == 3) {
              const savedPropertyId =
                typeof savedTags === 'object' ? savedTags.id : savedTags;
              this.propertie_id = savedPropertyId;
            }
            // Para atributos de selección múltiple
            else if (this.type_attribute_specification == 4) {
              this.selectedItemsTags = savedTags
                .map((tag: any) => {
                  const tagId = typeof tag === 'object' ? tag.id : tag;
                  return this.dropdownList.find(
                    (item: any) => item.id === tagId
                  );
                })
                .filter((item: any) => item !== undefined);
            }
          } catch (error) {
            console.error('Error restoring tags/property:', error);
          }
        }
      } else {
        this.properties = [];
        this.dropdownList = [];

        // Para atributos de texto o número, establece value_add directamente
        if (this.specification.value_add) {
          this.value_add = this.specification.value_add;
        }
      }
    } else {
      console.error(
        'No matching attribute found for ID:',
        this.specification.attribute_id
      );
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
      this.type_attribute_specification = ATTRIBUTE.type_attribute;
      if (
        this.type_attribute_specification == 3 ||
        this.type_attribute_specification == 4
      ) {
        this.properties = ATTRIBUTE.properties || [];

        this.propertie_id = '';
      } else {
        this.properties = [];
      }
    } else {
      this.type_attribute_specification = 0;
      this.properties = [];
    }
  }
}
