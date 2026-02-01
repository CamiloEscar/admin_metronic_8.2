import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  /**
   * Sube una imagen de producto al backend. El backend debe devolver la URL de Cloudinary.
   * endpoint ejemplo: POST {URL_SERVICIOS}/admin/products/{id}/image
   */
  uploadProductImage(productId: number | string, file: File): Observable<any> {
    const form = new FormData();
    form.append('image', file);

    // Ajusta la ruta si tu API usa otro path
    const url = `${URL_SERVICIOS}/admin/products/${productId}/image`;

    // opcional: usar HttpRequest para reportar progreso
    const req = new HttpRequest('POST', url, form, { reportProgress: true });
    return this.http.request(req);
  }
}
