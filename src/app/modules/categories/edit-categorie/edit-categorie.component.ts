import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from '../service/categories.service';
import { ActivatedRoute } from '@angular/router';
import { URL_IMAGEN } from 'src/app/config/config';

@Component({
  selector: 'app-edit-categorie',
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.scss'],
})
export class EditCategorieComponent {
  type_categorie: number = 1;

  name: string = '';
  icon: string = '';
  position: number = 1;
  categorie_second_id: string = '';

  categorie_third_id: string = '';
  state: string = '1';

  imagen_previsualizacion: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';

  file_imagen: any = null;

  isLoading$: any;

  categorie_first: any = [];
  categorie_seconds: any = [];
  categorie_seconds_backups: any = [];

  CATEGORIE_ID: string = '';
  CATEGORIE:any = null;

  constructor(
    public categorieService: CategoriesService,
    public toast: ToastrService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.categorieService.isLoading$;

    this.config();

    this.activatedRoute.params.subscribe((resp: any) => {
      console.log(resp);
      this.CATEGORIE_ID = resp.id;
    });

    this.categorieService
      .showCategorie(this.CATEGORIE_ID)
      .subscribe((resp: any) => {
        console.log(resp);
        this.CATEGORIE = resp.categorie;
        this.type_categorie = resp.categorie.type_categorie;
        this.name = resp.categorie.name;
        this.icon = resp.categorie.icon;
        this.position = resp.categorie.position;
        this.categorie_second_id = resp.categorie.categorie_second_id;
        this.categorie_third_id = resp.categorie.categorie_third_id;
        if (resp.categorie.imagen) {
          // Check if it's a full URL or a relative path
          if (resp.categorie.imagen.startsWith('http')) {
            this.imagen_previsualizacion = resp.categorie.imagen;
          } else {
            // For local development, use your API base URL
            const baseUrl = URL_IMAGEN; // Replace with your Laravel API URL
            const imagePath = resp.categorie.imagen.startsWith('storage/')
              ? resp.categorie.imagen
              : `storage/${resp.categorie.imagen}`;
            this.imagen_previsualizacion = `${baseUrl}/${imagePath}`;
          }
        }
      });
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
    this.categorie_second_id = '';
    this.categorie_third_id = '';
  }
  changeDepartamento() {
    this.categorie_seconds_backups = this.categorie_seconds.filter((item:any) => item.categorie_second_id == this.categorie_third_id)
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

    // if (this.type_categorie === 1 && !this.file_imagen) {
    //   this.toast.error('Debe seleccionar una imagen', 'Error');
    //   return;
    // }

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
    if (this.icon) {
      formData.append('icon', this.icon);
    } else {
      if(this.CATEGORIE.icon) {
        formData.append('icon', '');
      }
    }
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

    formData.append('state', this.state);

    this.categorieService
      .updateCategories(formData, this.CATEGORIE_ID)
      .subscribe((resp: any) => {
        console.log(resp);

        if (resp.message === 403) {
          this.toast.error('No tiene permisos para crear categorias', 'Error');
          return;
        }

        this.toast.success('Categoría actualizada exitosamente', 'Éxito');
        this.config();
      });
  }
}
