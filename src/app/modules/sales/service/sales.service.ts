import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient, //nos permite hacer peticiones http definir la ruta, enviar datos y recibir datos de la api
    public authservice: AuthService //podemos obtener el token del usuario identificado
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  listSales(page: number = 1, data:any) {
    this.isLoadingSubject.next(true)

    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/sales/list?page='+page;
    return this.http.post(URL, data, { headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  configAll() {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/products/config';
    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  configAllReport(){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/kpi/config';
    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  reportSaleForCountry(data:any) {
    this.isLoadingSubject.next(true)

    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/kpi/report_sales_country_for_year';
    return this.http.post(URL, data, { headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  reportSaleForWeek() {
    this.isLoadingSubject.next(true)

    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/kpi/report_sales_week_categorias';
    return this.http.post(URL, {}, { headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  reportSaleForDiscountWeek() {
    this.isLoadingSubject.next(true)

    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/kpi/report_sales_week_discounts';
    return this.http.post(URL, {}, { headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  reportSaleForMonth(data:any){
    this.isLoadingSubject.next(true)

    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/kpi/report_sales_month_selected';
    return this.http.post(URL, data, { headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
