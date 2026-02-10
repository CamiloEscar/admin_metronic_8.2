import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class ProductSalesHistoryService {

  isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;

    constructor(
      private http: HttpClient,
      public authservice: AuthService
    ) {
      this.isLoadingSubject = new BehaviorSubject<boolean>(false);
      this.isLoading$ = this.isLoadingSubject.asObservable();
    }

  // Historial paginado
  getProductSalesHistory(productId: string, page: number = 1): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });

    let URL = URL_SERVICIOS + '/admin/products/' + productId + '/sales-history?page=' + page;

    return this.http.get(URL, { headers });
  }

  // Resumen del producto
  getProductSalesSummary(productId: string): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });

    let URL = URL_SERVICIOS + '/admin/products/' + productId + '/sales-summary';

    return this.http.get(URL, { headers });
  }
  updateShippingStatus(saleId: number, status: string) {
  let headers = new HttpHeaders({
    Authorization: 'Bearer ' + this.authservice.token,
  });

  let URL = URL_SERVICIOS + `/admin/sales/${saleId}/shipping-status`;

  return this.http
    .post(URL, { shipping_status: status }, { headers: headers })
    .pipe(finalize(() => this.isLoadingSubject.next(false)));
}

}
