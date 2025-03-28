import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../../service/attributes.service';
import { EditAnidadoVariacionesComponent } from '../edit-anidado-variaciones/edit-anidado-variaciones.component';
import { DeleteVariacionesSpecificationsComponent } from '../delete-variaciones-specifications/delete-variaciones-specifications.component';

@Component({
  selector: 'app-create-anidado-variaciones',
  templateUrl: './create-anidado-variaciones.component.html',
  styleUrls: ['./create-anidado-variaciones.component.scss'],
})
export class CreateAnidadoVariacionesComponent {
  @Input() variation: any = [];
  @Input() attributes_variations: any = [];

  isLoading$: any;

  attributes_specifications: any = [];
  properties: any = [];
  propertie_id: any = null;
  value_add: any = null;
  specifications: any = [];
  variations: any = [];

  specification_attribute_id: string = '';
  variations_attribute_id: string = '';
  type_attribute_specification: number = 1;
  type_attribute_variation: number = 3;
  attributes: any = [];

  precio_add: number = 0;
  stock_add: number = 0;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private modalService: NgbModal,

  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.isLoading$ = this.attributeService.isLoading$;
    this.listVariationsAnidada();
  }

  listVariationsAnidada(){
    this.attributeService.listVariationsAnidada(this.variation.product_id, this.variation.id).subscribe((resp:any) => {
      this.variations = resp.variations;
    });
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
      product_id: this.variation.product_id,
      attribute_id: this.variations_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
      add_price: this.precio_add,
      stock: this.stock_add,
      product_variation_id: this.variation.id,
    };

    this.attributeService.createVariationAnidadas(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error(
          'No tienes permisos para crear una nueva especificación',
          resp.message_text
        );
      } else {
        this.toastr.success("Exito",'la variacion anidada creada correctamente');
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


  getAttributeName(attribute_special: any): string {
    if (!attribute_special) return 'Desconocido';

    // First, check if the attribute is already in the attributes_variations array
    const attribute = this.attributes_variations.find(
      (attr: any) => attr.id == Number(attribute_special)
    );

    if (attribute) {
      return attribute.name;
    }

    // If not found in variations, check specifications
    const specAttribute = this.attributes_specifications.find(
      (attr: any) => attr.id == Number(attribute_special)
    );

    if (specAttribute) {
      return specAttribute.name;
    }

    return 'Desconocido';
  }

  getModalTitle(): string {
    if (this.variation && this.variation.attribute_id) {
      // First check in variations attributes
      const attribute = this.attributes_variations.find(
        (attr: any) => attr.id == Number(this.variation.attribute_id)
      );

      if (attribute) {
        return attribute.name;
      }

      // If not found, check in specifications
      const specAttribute = this.attributes_specifications.find(
        (attr: any) => attr.id == Number(this.variation.attribute_id)
      );

      if (specAttribute) {
        return specAttribute.name;
      }
    }

    return 'Variación Anidada';
  }
  getValueAttribute(attribute_special: any) {
    if (attribute_special.attribute_id) {
      const parentAttribute = this.attributes_variations.find(
        (attr: any) => attr.id == attribute_special.attribute_id
      );

      if (parentAttribute) {
        // For nested variations, look in the parent attribute's properties
        if (attribute_special.propertie_id) {
          const property = parentAttribute.properties?.find(
            (prop: any) => Number(prop.id) === Number(attribute_special.propertie_id)
          );

          if (property) {
            return property.name;
          }
        }

        // If no property found, use value_add
        if (attribute_special.value_add) {
          return attribute_special.value_add;
        }
      }
    }
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

  editVariation(variation: any) {
      const modal = this.modalService.open(
        EditAnidadoVariacionesComponent,
        { centered: true, size: 'md' }
      );

      // Make a deep copy of the variation to avoid reference issues
      modal.componentInstance.specification = JSON.parse(JSON.stringify(variation));
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
}
