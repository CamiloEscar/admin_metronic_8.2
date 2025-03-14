import { Component } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-categorie',
  templateUrl: './create-categorie.component.html',
  styleUrls: ['./create-categorie.component.scss'],
})
export class CreateCategorieComponent {
  type_categorie: number = 1;

  name: string = '';
  icon: string = '';
  position: number = 1;
  categorie_second_id: string = '';

  categorie_third_id: string = '';

  imagen_previsualizacion: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';

  file_imagen: any = null;

  isLoading$: any;

  categorie_first: any = [];
  categorie_seconds: any = [];

  constructor(
    public categorieService: CategoriesService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.categorieService.isLoading$;

    this.config();
  }

  config() {
    this.categorieService.configCategories().subscribe((resp: any) => {
      this.categorie_first = resp.categorie_first;
      this.categorie_seconds = resp.categorie_seconds;
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
    this.categorieService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.categorieService.isLoadingSubject.next(false);
    }, 50);
  }

  changeTypeCategorie(val: number) {
    this.type_categorie = val;
  }

  save() {
    if (!this.name || !this.position) {
      this.toast.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    if (this.type_categorie === 1 && !this.icon) {
      this.toast.error('Debe seleccionar un icono', 'Error');
      return;
    }

    if (this.type_categorie === 1 && !this.file_imagen) {
      this.toast.error('Debe seleccionar una imagen', 'Error');
      return;
    }

    if (this.type_categorie === 2 && !this.categorie_second_id) {
      this.toast.error('El departamento es obligatorio', 'Error');
      return;
    }

    if (
      this.type_categorie === 3 &&
      (!this.categorie_second_id || !this.categorie_third_id)
    ) {
      this.toast.error(
        'El departamento y la categoria es obligatorio',
        'Error'
      );
      return;
    }

    let formData = new FormData();
    formData.append('name', this.name);
    formData.append('icon', this.icon);
    formData.append('position', this.position + '');
    formData.append('type_categorie', this.type_categorie + '');

    if (this.file_imagen) {
      formData.append('imagen', this.file_imagen);
    }
    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    }
    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    }

    this.categorieService.createCategories(formData).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message === 403) {
        this.toast.error('No tiene permisos para crear categorias', 'Error');
        return;
      }

      (this.name = ''),
        (this.icon = ''),
        (this.position = 1),
        (this.type_categorie = 1),
        (this.file_imagen = null),
        (this.imagen_previsualizacion =
          'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg'),
        (this.categorie_second_id = ''),
        (this.categorie_third_id = '');
      this.toast.success('Categoría creada exitosamente', 'Éxito');
      this.config();
    });
  }
}
