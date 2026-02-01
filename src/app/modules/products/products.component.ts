import { Component } from '@angular/core';
import { UploadService } from './upload.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  selectedFile?: File | null = null;
  uploadProgress = 0;

  constructor(private uploadService: UploadService) {}

  // Llamar desde la vista: (change)="onFileSelected($event, product.id)"
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  // Llamar desde la vista con el id del producto
  uploadForProduct(productId: number | string) {
    if (!this.selectedFile) {
      console.warn('No file selected');
      return;
    }

    this.uploadProgress = 0;
    this.uploadService.uploadProductImage(productId, this.selectedFile).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        } else if (event.type === HttpEventType.Response) {
          // La API debe devolver la URL de la imagen en la respuesta
          console.log('Upload finished', event.body);
          // ejemplo: event.body.data.url o event.body.url según tu API
        }
      },
      error: (err) => {
        console.error('Upload error', err);
      }
    });
  }

}
