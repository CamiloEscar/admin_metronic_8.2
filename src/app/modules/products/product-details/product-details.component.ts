import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../service/product.service';
import { ProductSalesHistoryService } from '../service/product-sales-history.service';
import { ProductStockMovementService } from '../service/product-stock-movement.service';
import { URL_SERVICIOS } from 'src/app/config/config';

declare var ApexCharts: any;

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {

  PRODUCT_ID: string = '';
  PRODUCT: any = null;
  isLoading: boolean = false;

  // STOCK
  stock_movements: any[] = [];
  stock_summary: any = null;
  showStockSection: boolean = false;
  stockChart: any = null; // Guardar referencia al gráfico

  // VENTAS
  sales_history: any[] = [];
  sales_summary: any = null;
  salesCurrentPage: number = 1;
  salesTotalPages: number = 0;
  showSalesSection: boolean = false;
  showSalesSummary: boolean = false; // NUEVO: toggle para resumen de ventas

  URL_SERVICIOS: any = URL_SERVICIOS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private stockMovementService: ProductStockMovementService,
    private salesHistoryService: ProductSalesHistoryService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.PRODUCT_ID = params.id;
      this.loadProduct();
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // Limpiar gráfico al destruir el componente
    if (this.stockChart) {
      this.stockChart.destroy();
      this.stockChart = null;
    }
  }

  loadProduct() {
    this.isLoading = true;

    this.productService.showProduct(this.PRODUCT_ID).subscribe({
      next: (resp: any) => {
        this.PRODUCT = resp.product;

        this.loadStockMovements();
        this.loadStockSummary();
        this.loadSalesHistory();
        this.loadSalesSummary();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastr.error('Error al cargar el producto', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ==================== STOCK ====================

  loadStockMovements() {
    console.log('1. Llamando a loadStockMovements');

    this.stockMovementService.listMovements(this.PRODUCT_ID).subscribe(
      (resp: any) => {
        console.log('2. Respuesta movimientos:', resp);

        this.stock_movements = resp.movements || [];

        // No inicializar el gráfico aquí, solo cargar los datos
        console.log('3. Movimientos cargados:', this.stock_movements.length);
      }
    );
  }

  initStockChart() {
    console.log('5. Entrando a initStockChart');

    // Limpiar gráfico anterior si existe
    if (this.stockChart) {
      this.stockChart.destroy();
      this.stockChart = null;
    }

    // Buscar el elemento solo si la sección está visible
    const chartElement = document.getElementById('kt_product_stock_movements_chart');
    console.log('6. Elemento gráfico:', chartElement);

    if (!chartElement) {
      console.log('7. NO existe el contenedor del gráfico - La sección puede estar colapsada');
      return;
    }

    if (this.stock_movements.length === 0) {
      console.log('8. No hay movimientos para graficar');
      // Opcional: mostrar un mensaje en el contenedor del gráfico
      chartElement.innerHTML = '<div class="text-center text-muted p-5">No hay datos para mostrar</div>';
      return;
    }

    // Ordenar movimientos por fecha (más antiguo a más reciente)
    const sortedMovements = [...this.stock_movements].sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const dates = sortedMovements.map((m: any) =>
      new Date(m.created_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    );

    const stockLevels = sortedMovements.map((m: any) => m.stock_after);

    console.log('9. Datos del gráfico:', {
      dates,
      stockLevels
    });

    const options = {
      series: [{
        name: 'Stock',
        data: stockLevels
      }],
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      xaxis: {
        categories: dates,
        labels: {
          rotate: -45,
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Cantidad en Stock'
        },
        min: 0
      },
      tooltip: {
        y: {
          formatter: function(val: number) {
            return val + ' unidades';
          }
        }
      },
      markers: {
        size: 5,
        hover: {
          size: 8
        }
      },
      colors: ['#00A3FF']
    };

    console.log('10. Creando instancia ApexCharts');

    try {
      this.stockChart = new ApexCharts(chartElement, options);
      this.stockChart.render();
      console.log('11. Gráfico renderizado exitosamente');
    } catch (error) {
      console.error('Error al renderizar gráfico:', error);
    }
  }

  // Método para mostrar/ocultar la sección de stock
  toggleStockSection() {
    this.showStockSection = !this.showStockSection;

    // Esperar a que Angular actualice el DOM
    this.cdr.detectChanges();

    if (this.showStockSection) {
      // Inicializar el gráfico después de que la sección esté visible
      setTimeout(() => {
        this.initStockChart();
      }, 100); // Pequeño delay para asegurar que el DOM se actualizó
    } else {
      // Limpiar el gráfico cuando se oculta la sección
      if (this.stockChart) {
        const chartElement = document.getElementById('kt_product_stock_movements_chart');
        if (chartElement) {
          chartElement.innerHTML = ''; // Limpiar el contenedor
        }
        this.stockChart.destroy();
        this.stockChart = null;
      }
    }
  }

  loadStockSummary() {
    this.stockMovementService.getSummary(this.PRODUCT_ID).subscribe(
      (resp: any) => {
        this.stock_summary = resp;
      },
      () => {
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

        this.cdr.detectChanges();

        // CAMBIADO: Solo inicializar gráficos si el resumen está visible
        if (this.sales_history.length > 0 && this.showSalesSummary) {
          setTimeout(() => {
            this.initSalesCharts();
          }, 200);
        }
      },
      () => {
        this.sales_history = [];
      }
    );
  }

  loadSalesSummary() {
    this.salesHistoryService.getProductSalesSummary(this.PRODUCT_ID).subscribe(
      (resp: any) => {
        this.sales_summary = resp;
      },
      () => {
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
      () => {
        this.toastr.error('Error al actualizar el estado', 'Error');
      }
    );
  }

  // NUEVO: Método para toggle del resumen de ventas
  toggleSalesSummary() {
    this.showSalesSummary = !this.showSalesSummary;

    // Esperar a que Angular actualice el DOM
    this.cdr.detectChanges();

    if (this.showSalesSummary && this.sales_history.length > 0) {
      // Inicializar los gráficos después de que la sección esté visible
      setTimeout(() => {
        this.initSalesCharts();
      }, 200);
    }
  }

  // ==================== GRÁFICOS ====================

  initStockMovementsChart() {
    const chartElement = document.getElementById('kt_product_stock_movements_chart');

    if (!chartElement || this.stock_movements.length === 0) return;

    let categories: string[] = [];
    let ingresos: number[] = [];
    let egresos: number[] = [];

    this.stock_movements.forEach((movement: any) => {
      const date = movement.created_at.split(' ')[0];

      if (!categories.includes(date)) {
        categories.push(date);
        ingresos.push(0);
        egresos.push(0);
      }

      const index = categories.indexOf(date);

      if (movement.type === 'ingreso') {
        ingresos[index] += movement.quantity;
      } else if (movement.type === 'egreso') {
        egresos[index] += Math.abs(movement.quantity);
      }
    });

    const options = {
      series: [
        { name: "Ingresos", data: ingresos },
        { name: "Egresos", data: egresos }
      ],
      chart: { type: "bar", height: 350 },
      xaxis: { categories: categories }
    };

    const chart = new ApexCharts(chartElement, options);
    chart.render();
  }

  initSalesCharts() {
    this.initProfitDiscountChart(); // CAMBIADO: nuevo gráfico
    this.initSalesTimelineChart();
  }

  // NUEVO: Gráfico de Ganancias vs Descuentos
  initProfitDiscountChart() {
    const chartElement = document.getElementById("kt_product_profit_discount_chart");
    if (!chartElement) return;

    let totalRevenue = 0;
    let totalDiscount = 0;

    this.sales_history.forEach((sale: any) => {
      const total = parseFloat(sale.total || 0);
      const discount = parseFloat(sale.discount_amount || 0);

      totalRevenue += total;
      totalDiscount += discount;
    });

    const totalProfit = totalRevenue; // Ganancia real (total después de descuentos)
    const labels = ['Ganancias', 'Descuentos'];
    const series = [totalProfit, totalDiscount];
    const colors = ['#00D97E', '#F1416C']; // Verde para ganancias, Rojo para descuentos

    const options = {
      series: series,
      chart: {
        type: "donut",
        width: 380,
        height: 350
      },
      labels: labels,
      colors: colors,
      stroke: { width: 0 },
      legend: {
        show: true,
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 600
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: number) {
          return val.toFixed(1) + '%';
        },
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontWeight: 600
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 'bold',
                formatter: function(val: string) {
                  return '$' + parseFloat(val).toFixed(0);
                }
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '16px',
                fontWeight: 600,
                formatter: function() {
                  return '$' + (totalProfit + totalDiscount).toFixed(0);
                }
              }
            }
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(val: number) {
            return '$' + val.toFixed(2);
          }
        }
      }
    };

    const chart = new ApexCharts(chartElement, options);
    chart.render();
  }

  initSalesTimelineChart() {
    const chartElement = document.getElementById("kt_product_sales_timeline_chart");
    if (!chartElement) return;

    const salesByDate: any = {};
    this.sales_history.forEach((sale: any) => {
      const date = sale.created_at.split(' ')[0];
      salesByDate[date] = (salesByDate[date] || 0) + parseFloat(sale.total || 0);
    });

    const categories = Object.keys(salesByDate).sort();
    const data = categories.map(date => salesByDate[date]);

    const options = {
      series: [{ name: "Ventas", data: data }],
      chart: { type: "area", height: 350 },
      xaxis: { categories: categories }
    };

    const chart = new ApexCharts(chartElement, options);
    chart.render();
  }

  // ==================== HELPERS ====================

  getPaymentMethodLabel(method: string): string {
    const methods: any = {
      MERCADOPAGO: 'Mercado Pago',
      TRANSFERENCIA: 'Transferencia',
      EFECTIVO: 'Efectivo',
      TARJETA: 'Tarjeta',
      PAYPAL: 'PayPal',
    };
    return methods[method] || method;
  }

  getPaymentMethodBadgeClass(method: string): string {
    const classes: any = {
      MERCADOPAGO: 'badge-primary',
      TRANSFERENCIA: 'badge-info',
      EFECTIVO: 'badge-success',
      TARJETA: 'badge-warning',
      PAYPAL: 'badge-info',
    };
    return classes[method] || 'badge-secondary';
  }

  getStateLabel(state: number): string {
    return state === 2 ? 'Activo' : 'Inactivo';
  }

  getStateBadgeClass(state: number): string {
    return state === 2 ? 'badge-light-success' : 'badge-light-warning';
  }
}
