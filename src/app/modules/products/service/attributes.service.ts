import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root',
})
export class AttributesService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, public authservice: AuthService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  configAll() {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/variations/config';
    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  showProduct(product_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/products/' + product_id;
    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  listSpecification(product_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/specifications?product_id=' + product_id;
    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  createSpecification(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/specifications';
    return this.http
      .post(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  updateSpecification(specificacion_id: string, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/specifications/' + specificacion_id;
    return this.http
      .put(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteSpecification(specificacion_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/specifications/' + specificacion_id;
    return this.http
      .delete(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  //Variaciones
  createVariation(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/variations';
    return this.http
      .post(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  updateVariation(variation_id: string, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/variations/' + variation_id;
    return this.http
      .put(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteVariation(variation_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/variations/' + variation_id;
    return this.http
      .delete(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  listVariations(product_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/variations?product_id=' + product_id;
    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
  //Variaciones ANIDADAS
  createVariationAnidadas(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/anidado_variations';
    return this.http
      .post(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  updateVariationAnidadas(variation_id: string, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/anidado_variations/' + variation_id;
    return this.http
      .put(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteVariationAnidadas(variation_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/anidado_variations/' + variation_id;
    return this.http
      .delete(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  listVariationsAnidada(product_id: string, product_variation_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL =
      URL_SERVICIOS +
      '/admin/anidado_variations?product_id=' +
      product_id +
      '&product_variation_id=' +
      product_variation_id;
    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
}
