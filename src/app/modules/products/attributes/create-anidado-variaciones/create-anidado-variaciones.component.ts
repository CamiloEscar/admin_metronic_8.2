import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../../service/attributes.service';

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
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.isLoading$ = this.attributeService.isLoading$;
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

  saveVariation() {}

  store() {}

  getAttributeName(attributeId: any): string {
    if (!attributeId) return 'Desconocido';

    const attribute = this.attributes_specifications.find(
      (attr: any) => attr.id === Number(attributeId)
    );
    return attribute ? attribute.name : 'Desconocido';
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

  editVariation(variation: any) {}
  deleteVariation(variation: any) {}
}
