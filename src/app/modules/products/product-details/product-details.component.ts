import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../service/product.service';
import { ProductSalesHistoryService } from '../service/product-sales-history.service';
import { ProductStockMovementService } from '../service/product-stock-movement.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  PRODUCT_ID: string = '';
  PRODUCT: any = null;
  isLoading: boolean = false;

  // STOCK
  stock_movements: any[] = [];
  stock_summary: any = null;

  // VENTAS
  sales_history: any[] = [];
  sales_summary: any = null;
  salesCurrentPage: number = 1;
  salesTotalPages: number = 0;

  URL_SERVICIOS: any = URL_SERVICIOS;

  showStockSection: boolean = false;
  showSalesSection: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private stockMovementService: ProductStockMovementService,
    private salesHistoryService: ProductSalesHistoryService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef  // <-- AGREGAR ESTO
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.PRODUCT_ID = params.id;
      console.log('ID recibido:', this.PRODUCT_ID);
      this.loadProduct();
    });
  }

  loadProduct() {
    console.log('🔵 loadProduct iniciado, ID:', this.PRODUCT_ID);
    this.isLoading = true;

    this.productService.showProduct(this.PRODUCT_ID).subscribe({
      next: (resp: any) => {
        console.log('✅ Respuesta recibida:', resp);
        this.PRODUCT = resp.product;
        console.log('✅ PRODUCT asignado:', this.PRODUCT);
        console.log('✅ PRODUCT title:', this.PRODUCT?.title);

        // Cargar datos relacionados
        this.loadStockMovements();
        this.loadStockSummary();
        this.loadSalesHistory();
        this.loadSalesSummary();

        this.isLoading = false;
        console.log('✅ isLoading = false');

        // FORZAR detección de cambios
        this.cdr.detectChanges();  // <-- AGREGAR ESTO
        console.log('✅ detectChanges ejecutado');
      },
      error: (error) => {
        console.error('❌ Error cargando producto:', error);
        this.toastr.error('Error al cargar el producto', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();  // <-- AGREGAR ESTO
      },
      complete: () => {
        console.log('🏁 Observable completado');
      }
    });
  }

  // ==================== STOCK ====================

  loadStockMovements() {
    this.stockMovementService.listMovements(this.PRODUCT_ID).subscribe(
      (resp: any) => {
        this.stock_movements = resp.movements || [];
        console.log('Movimientos de stock recibidos:', this.stock_movements);
      },
      (error) => {
        console.error('Error al cargar movimientos de stock:', error);
        this.stock_movements = [];
      }
    );
  }

  loadStockSummary() {
    this.stockMovementService.getSummary(this.PRODUCT_ID).subscribe(
      (resp: any) => {
        this.stock_summary = resp;
        console.log('Resumen de stock recibido:', this.stock_summary);
      },
      (error) => {
        console.error('Error al cargar resumen de stock:', error);
        this.stock_summary = null;
      }
    );
  }

  getMovementTypeLabel(type: string): string {
    const types: any = {
      ingreso: 'Ingreso',
      egreso: 'Egreso',
      ajuste: 'Ajuste',
    };
    return types[type] || type;
  }

  getMovementTypeBadgeClass(type: string): string {
    const classes: any = {
      ingreso: 'badge-success',
      egreso: 'badge-danger',
      ajuste: 'badge-warning',
    };
    return classes[type] || 'badge-secondary';
  }

  // ==================== VENTAS ====================

  loadSalesHistory(page: number = 1) {
    this.salesHistoryService.getProductSalesHistory(this.PRODUCT_ID, page).subscribe(
      (resp: any) => {
        this.sales_history = (resp.sales || []).map((sale: any) => ({
          ...sale,
          shipping_status: sale.shipping_status ?? 'pending'
        }));

        this.salesTotalPages = resp.total || 0;
        this.salesCurrentPage = page;

        console.log('Historial de ventas recibido:', this.sales_history);
        console.log('Total de páginas:', this.salesTotalPages);
      },
      (error) => {
        console.error('Error al cargar historial de ventas:', error);
        this.sales_history = [];
      }
    );
  }

  loadSalesSummary() {
    this.salesHistoryService.getProductSalesSummary(this.PRODUCT_ID).subscribe(
      (resp: any) => {
        this.sales_summary = resp;
        console.log('Resumen de ventas recibido:', this.sales_summary);
      },
      (error) => {
        console.error('Error al cargar resumen de ventas:', error);
        this.sales_summary = null;
      }
    );
  }

  loadSalesPage(page: number) {
    if (page >= 1 && page <= this.salesTotalPages) {
      this.loadSalesHistory(page);
    }
  }

  updateShippingStatus(sale: any) {
    this.salesHistoryService.updateShippingStatus(sale.id, sale.shipping_status).subscribe(
      (resp: any) => {
        if (resp.message === 200) {
          this.toastr.success('Estado actualizado', 'Éxito');
        } else {
          this.toastr.error('Error al actualizar el estado', 'Error');
        }
      },
      (error) => {
        console.error('Error al actualizar estado de envío:', error);
        this.toastr.error('Error al actualizar el estado', 'Error');
      }
    );
  }

  getPaymentMethodLabel(method: string): string {
    const methods: any = {
      MERCADOPAGO: 'Mercado Pago',
      TRANSFERENCIA: 'Transferencia',
      EFECTIVO: 'Efectivo',
      TARJETA: 'Tarjeta',
    };
    return methods[method] || method;
  }

  getPaymentMethodBadgeClass(method: string): string {
    const classes: any = {
      MERCADOPAGO: 'badge-primary',
      TRANSFERENCIA: 'badge-info',
      EFECTIVO: 'badge-success',
      TARJETA: 'badge-warning',
    };
    return classes[method] || 'badge-secondary';
  }

  getShippingStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'preparing':
        return 'Preparando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Sin estado';
    }
  }

  getShippingBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-light-warning';
      case 'preparing':
        return 'badge-light-info';
      case 'shipped':
        return 'badge-light-primary';
      case 'delivered':
        return 'badge-light-success';
      case 'cancelled':
        return 'badge-light-danger';
      default:
        return 'badge-light-secondary';
    }
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.salesTotalPages }, (_, i) => i + 1);
  }

  getStateLabel(state: number): string {
    return state === 2 ? 'Activo' : 'Inactivo';
  }

  getStateBadgeClass(state: number): string {
    return state === 2 ? 'badge-light-success' : 'badge-light-warning';
  }
}
