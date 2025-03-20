import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SlidersService } from '../services/sliders.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-sliders',
  templateUrl: './edit-sliders.component.html',
  styleUrls: ['./edit-sliders.component.scss']
})
export class EditSlidersComponent {
 title: string = '';
  label: string = '';
  subtitle: string = '';
  link: string = '';
  color: string = '';
  state: number = 1;
  imagen_previsualizacion: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  file_imagen: any = null;

  isLoading$: any;

  slider_id: string = '';
  constructor(
    public slidersService: SlidersService,
    public toast: ToastrService,
    public activeRouted: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.slidersService.isLoading$;
    this.activeRouted.params.subscribe((resp:any) => {
      this.slider_id = resp.id
    });

    this.slidersService.showSlider(this.slider_id).subscribe((resp: any) => {
      console.log(resp);
      this.title = resp.slider.title;
      this.label = resp.slider.label;
      this.subtitle = resp.slider.subtitle;
      this.link = resp.slider.link;
      this.color = resp.slider.color;
      this.imagen_previsualizacion = resp.slider.imagen;
    });
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
    if (!this.title || !this.subtitle) {
      this.toast.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);

    if (this.label) {
      formData.append('label', this.label);
    }
    formData.append('subtitle', this.subtitle + '');

    if(this.file_imagen){
      formData.append('imagen', this.file_imagen);
    }

    if (this.color) {
      formData.append('color', this.color);
    }
    if (this.link) {
      formData.append('link', this.link + '');
    }

    this.slidersService.updateSliders(formData, this.slider_id).subscribe((resp: any) => {
      console.log(resp);
        this.toast.success('El slider editado creada exitosamente', 'Éxito');
    });
  }
}

