import { Component, EventEmitter, Output } from '@angular/core';
import { BrandService } from '../service/brand.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss']
})
export class CreateBrandComponent {

  @Output() BrandC: EventEmitter<any> = new EventEmitter();

  name:string = '';
  isLoading$:any;
  marcaExistente: boolean = false;

  constructor(
    public brandService: BrandService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.brandService.isLoading$;
  }

  continuarEditando() {
    this.marcaExistente = false;
  }

 store() {
  this.marcaExistente = false;

  if (!this.name) {
    this.toastr.error("Validación", "Todos los campos son necesarios");
    return;
  }

  let data = {
    name: this.name,
    state: 1,
  };

  this.brandService.createBrands(data).subscribe({
    next: (resp: any) => {
      console.log('Respuesta completa del backend:', resp);
      
      // Verificar si el backend devuelve un error en lugar de la marca
      if (resp.message === 403) {
        this.toastr.error("Validación", "EL NOMBRE DE LA MARCA YA EXISTE EN LA BASE DE DATOS");
        return;
      }

      // Si hay una marca en la respuesta, emitirla
      if (resp.brand) {
        this.BrandC.emit(resp.brand);
      }
      
      this.toastr.success("Éxito", "LA MARCA SE HA REGISTRADO CORRECTAMENTE");
      this.modal.close();
    },
    error: (error: any) => {
      if (error.status === 403 && error.error?.message === 'La marca ya existe') {
        this.marcaExistente = true;
        return;
      }

      if (error.status === 403) {
        this.toastr.error("Validación", "EL NOMBRE DE LA MARCA YA EXISTE EN LA BASE DE DATOS");
        return;
      }

      this.toastr.error("Error", "Error inesperado al crear la marca");
    }
  });
 }
}