import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class CostosenvioService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  listCostos(page: number = 1, search: string = '') {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    const URL = `${URL_SERVICIOS}/admin/costoenvio?page=${page}&search=${search}`;
    return this.http
      .get(URL, { headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  configCostos() {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/costoenvio/config';
    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  createCosto(data: any) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    const URL = `${URL_SERVICIOS}/admin/costoenvio`;
    return this.http
      .post(URL, data, { headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  showCosto(costo_id: string) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    const URL = `${URL_SERVICIOS}/admin/costoenvio/${costo_id}`;
    return this.http
      .get(URL, { headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  updateCosto(costo_id: string, data: any) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    const URL = `${URL_SERVICIOS}/admin/costoenvio/${costo_id}`;
    return this.http
      .put(URL, data, { headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteCosto(costo_id: string) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    const URL = `${URL_SERVICIOS}/admin/costoenvio/${costo_id}`;
    return this.http
      .delete(URL, { headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
}
