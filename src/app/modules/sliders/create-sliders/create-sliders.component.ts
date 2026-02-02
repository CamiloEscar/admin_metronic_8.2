import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from '../../categories/service/categories.service';
import { SlidersService } from '../services/sliders.service';

@Component({
  selector: 'app-create-sliders',
  templateUrl: './create-sliders.component.html',
  styleUrls: ['./create-sliders.component.scss'],
})
export class CreateSlidersComponent {
  title: string = '';
  label: string = '';
  subtitle: string = '';
  link: string = '';
  color: string = '';
  type_slider: any = 1;
  price_original: any = null;
  price_campaing: any = null;

  imagen_previsualizacion: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  file_imagen: any = null;

  isLoading$: any;

  constructor(
    public slidersService: SlidersService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.slidersService.isLoading$;
  }

  processFile($event: any) {
    const file = $event.target.files[0];

    // Verificar si el archivo es una imagen
    if (!file.type.startsWith('image/')) {
      this.toast.error('El archivo seleccionado no es una imagen', 'Error');
      return;
    }

    this.file_imagen = file;

    // Leer el archivo y convertirlo en una URL para la previsualización
    const reader = new FileReader();
    reader.onload = () => {
      this.imagen_previsualizacion = reader.result; // Actualiza la previsualización
      this.isLoadingView();
    };
    reader.readAsDataURL(file);
  }

  isLoadingView() {
    this.slidersService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.slidersService.isLoadingSubject.next(false);
    }, 50);
  }

  save() {
    if (!this.title || !this.subtitle || !this.file_imagen) {
      this.toast.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);

    if (this.label) {
      formData.append('label', this.label);
    }
    formData.append('subtitle', this.subtitle + '');
    formData.append('imagen', this.file_imagen);

    formData.append('type_slider', this.type_slider)

    if (this.price_original) {
      formData.append('price_original', this.price_original);
    }
    if (this.price_campaing) {
      formData.append('price_campaing', this.price_campaing);
    }

    if (this.color) {
      formData.append('color', this.color);
    }
    if (this.link) {
      formData.append('link', this.link + '');
    }

    this.slidersService.createSliders(formData).subscribe((resp: any) => {
      //console.log(resp);

      if (resp.message === 403) {
        this.toast.error('No tiene permisos para crear categorias', 'Error');
        return;
      }

      (this.title = ''),
        (this.label = ''),
        (this.subtitle = ''),
        (this.link = ''),
        (this.color = ''),
        (this.file_imagen = null),
        (this.imagen_previsualizacion =
          'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg'),
        this.toast.success('El slider creada exitosamente', 'Éxito');
    });
  }
}
