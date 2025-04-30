import { Component, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { SalesService } from 'src/app/modules/sales/service/sales.service';

declare var KTUtil:any;
declare var KTThemeMode:any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;

  isLoading$:any;

  meses:any = [];
  year_current:string = '';
  month_current:string = '';
  year_1:string = '';
  month_1:string = '';

  porcentageV_sale_for_country:number = 0;
  sales_for_year_for_country:any = null;
  constructor(
    public salesService: SalesService,
  ) {}

  async openModal() {
    return await this.modalComponent.open();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.salesService.isLoading$;
    this.salesService.configAllReport().subscribe((resp:any) => {
      console.log(resp)

      //meses, año y mes
      this.meses = resp.meses;
      this.year_current = resp.year;
      this.month_current = resp.month;

      //auxiliares
      this.year_1 = resp.year;
      this.month_1 = resp.month;

      this.reportSaleForCountry();
    })



    let KTCardsWidget6 = {
      init: function () {
        var e = document.getElementById("kt_card_widget_6_chart");
        if (e) {
              var t = parseInt(KTUtil.css(e, "height")),
                a = KTUtil.getCssVariableValue("--bs-gray-500"),
                l = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                r = KTUtil.getCssVariableValue("--bs-primary"),
                o = KTUtil.getCssVariableValue("--bs-gray-300"),
                i = new ApexCharts(e, {
                    series: [{
                      name: "Sales",
                      data: [30, 60, 53, 45, 60, 75, 53]
                    }],
                    chart: {
                      fontFamily: "inherit",
                      type: "bar",
                      height: t,
                      toolbar: {
                          show: !1
                      },
                      sparkline: {
                          enabled: !0
                      }
                    },
                    plotOptions: {
                      bar: {
                          horizontal: !1,
                          columnWidth: ["55%"],
                          borderRadius: 6
                      }
                    },
                    legend: {
                      show: !1
                    },
                    dataLabels: {
                      enabled: !1
                    },
                    stroke: {
                      show: !0,
                      width: 9,
                      colors: ["transparent"]
                    },
                    xaxis: {
                      axisBorder: {
                          show: !1
                      },
                      axisTicks: {
                          show: !1,
                          tickPlacement: "between"
                      },
                      labels: {
                          show: !1,
                          style: {
                            colors: a,
                            fontSize: "12px"
                          }
                      },
                      crosshairs: {
                          show: !1
                      }
                    },
                    yaxis: {
                      labels: {
                          show: !1,
                          style: {
                            colors: a,
                            fontSize: "12px"
                          }
                      }
                    },
                    fill: {
                      type: "solid"
                    },
                    states: {
                      normal: {
                          filter: {
                            type: "none",
                            value: 0
                          }
                      },
                      hover: {
                          filter: {
                            type: "none",
                            value: 0
                          }
                      },
                      active: {
                          allowMultipleDataPointsSelection: !1,
                          filter: {
                            type: "none",
                            value: 0
                          }
                      }
                    },
                    tooltip: {
                      style: {
                          fontSize: "12px"
                      },
                      x: {
                          formatter: function (e:any) {
                            return "Feb: " + e
                          }
                      },
                      y: {
                          formatter: function (e:any) {
                            return e + "%"
                          }
                      }
                    },
                    colors: [r, o],
                    grid: {
                      padding: {
                          left: 10,
                          right: 10
                      },
                      borderColor: l,
                      strokeDashArray: 4,
                      yaxis: {
                          lines: {
                            show: !0
                          }
                      }
                    }
                });
              setTimeout((function () {
                i.render()
              }), 300)
        }
      }
    };
    KTUtil.onDOMContentLoaded((function () {
      KTCardsWidget6.init()
    }))

    var KTChartsWidget3 = function () {
      var e:any = {
            self: null,
            rendered: !1
         },
         t = function (e:any) {
            var t = document.getElementById("kt_charts_widget_3");
            if (t) {
               var a = parseInt(KTUtil.css(t, "height")),
                  l = KTUtil.getCssVariableValue("--bs-gray-500"),
                  r = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                  o = KTUtil.getCssVariableValue("--bs-success"),
                  i = {
                     series: [{
                        name: "Sales",
                        data: [18, 18, 20, 20, 18, 18, 22, 22, 20, 20, 18, 18, 20, 20, 18, 18, 20, 20, 22]
                     }],
                     chart: {
                        fontFamily: "inherit",
                        type: "area",
                        height: a,
                        toolbar: {
                           show: !1
                        }
                     },
                     plotOptions: {},
                     legend: {
                        show: !1
                     },
                     dataLabels: {
                        enabled: !1
                     },
                     fill: {
                        type: "gradient",
                        gradient: {
                           shadeIntensity: 1,
                           opacityFrom: .4,
                           opacityTo: 0,
                           stops: [0, 80, 100]
                        }
                     },
                     stroke: {
                        curve: "smooth",
                        show: !0,
                        width: 3,
                        colors: [o]
                     },
                     xaxis: {
                        categories: ["", "Apr 02", "Apr 03", "Apr 04", "Apr 05", "Apr 06", "Apr 07", "Apr 08", "Apr 09", "Apr 10", "Apr 11", "Apr 12", "Apr 13", "Apr 14", "Apr 15", "Apr 16", "Apr 17", "Apr 18", ""],
                        axisBorder: {
                           show: !1
                        },
                        axisTicks: {
                           show: !1
                        },
                        tickAmount: 6,
                        labels: {
                           rotate: 0,
                           rotateAlways: !0,
                           style: {
                              colors: l,
                              fontSize: "12px"
                           }
                        },
                        crosshairs: {
                           position: "front",
                           stroke: {
                              color: o,
                              width: 1,
                              dashArray: 3
                           }
                        },
                        tooltip: {
                           enabled: !0,
                           formatter: void 0,
                           offsetY: 0,
                           style: {
                              fontSize: "12px"
                           }
                        }
                     },
                     yaxis: {
                        tickAmount: 4,
                        max: 24,
                        min: 10,
                        labels: {
                           style: {
                              colors: l,
                              fontSize: "12px"
                           },
                           formatter: function (e:any) {
                              return "$" + e + "K"
                           }
                        }
                     },
                     states: {
                        normal: {
                           filter: {
                              type: "none",
                              value: 0
                           }
                        },
                        hover: {
                           filter: {
                              type: "none",
                              value: 0
                           }
                        },
                        active: {
                           allowMultipleDataPointsSelection: !1,
                           filter: {
                              type: "none",
                              value: 0
                           }
                        }
                     },
                     tooltip: {
                        style: {
                           fontSize: "12px"
                        },
                        y: {
                           formatter: function (e:any) {
                              return "$" + e + "K"
                           }
                        }
                     },
                     colors: [KTUtil.getCssVariableValue("--bs-success")],
                     grid: {
                        borderColor: r,
                        strokeDashArray: 4,
                        yaxis: {
                           lines: {
                              show: !0
                           }
                        }
                     },
                     markers: {
                        strokeColor: o,
                        strokeWidth: 3
                     }
                  };
               e.self = new ApexCharts(t, i), setTimeout((function () {
                  e.self.render(), e.rendered = !0
               }), 200)
            }
         };
      return {
         init: function () {
            t(e), KTThemeMode.on("kt.thememode.change", (function () {
               e.rendered && e.self.destroy(), t(e)
            }))
         }
      }
    }();

   KTUtil.onDOMContentLoaded((function () {
         KTChartsWidget3.init()
   }));

   var KTChartsWidget10Chart1 = function () {
      var e:any = {
            self: null,
            rendered: !1
         },
         t = function (e:any) {
            var t = document.getElementById("kt_charts_widget_10_chart_1");
            if (t) {
               var a = parseInt(KTUtil.css(t, "height")),
                  l = KTUtil.getCssVariableValue("--bs-gray-900"),
                  r = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                  o = {
                     series: [{
                        name: "Spent time",
                        data: [54, 42, 75, 110, 23, 87, 50]
                     }],
                     chart: {
                        fontFamily: "inherit",
                        type: "bar",
                        height: a,
                        toolbar: {
                           show: !1
                        }
                     },
                     plotOptions: {
                        bar: {
                           horizontal: !1,
                           columnWidth: ["28%"],
                           borderRadius: 5,
                           dataLabels: {
                              position: "top"
                           },
                           startingShape: "flat"
                        }
                     },
                     legend: {
                        show: !1
                     },
                     dataLabels: {
                        enabled: !0,
                        offsetY: -28,
                        style: {
                           fontSize: "13px",
                           colors: [l]
                        },
                        formatter: function (e:any) {
                           return e
                        }
                     },
                     stroke: {
                        show: !0,
                        width: 2,
                        colors: ["transparent"]
                     },
                     xaxis: {
                        categories: ["QA Analysis", "Marketing", "Web Dev", "Maths", "Front-end Dev", "Physics", "Phylosophy"],
                        axisBorder: {
                           show: !1
                        },
                        axisTicks: {
                           show: !1
                        },
                        labels: {
                           style: {
                              colors: KTUtil.getCssVariableValue("--bs-gray-500"),
                              fontSize: "13px"
                           }
                        },
                        crosshairs: {
                           fill: {
                              gradient: {
                                 opacityFrom: 0,
                                 opacityTo: 0
                              }
                           }
                        }
                     },
                     yaxis: {
                        labels: {
                           style: {
                              colors: KTUtil.getCssVariableValue("--bs-gray-500"),
                              fontSize: "13px"
                           },
                           formatter: function (e:any) {
                              return e + "H"
                           }
                        }
                     },
                     fill: {
                        opacity: 1
                     },
                     states: {
                        normal: {
                           filter: {
                              type: "none",
                              value: 0
                           }
                        },
                        hover: {
                           filter: {
                              type: "none",
                              value: 0
                           }
                        },
                        active: {
                           allowMultipleDataPointsSelection: !1,
                           filter: {
                              type: "none",
                              value: 0
                           }
                        }
                     },
                     tooltip: {
                        style: {
                           fontSize: "12px"
                        },
                        y: {
                           formatter: function (e:any) {
                              return +e + " hours"
                           }
                        }
                     },
                     colors: [KTUtil.getCssVariableValue("--bs-warning"), KTUtil.getCssVariableValue("--bs-warning-light")],
                     grid: {
                        borderColor: r,
                        strokeDashArray: 4,
                        yaxis: {
                           lines: {
                              show: !0
                           }
                        }
                     }
                  };
               e.self = new ApexCharts(t, o), setTimeout((function () {
                  e.self.render(), e.rendered = !0
               }), 200)
            }
         };
      return {
         init: function () {
            t(e), KTThemeMode.on("kt.thememode.change", (function () {
               e.rendered && e.self.destroy(), t(e)
            }))
         }
      }
   }();

   KTUtil.onDOMContentLoaded((function () {
      KTChartsWidget10Chart1.init()
   }));

   var KTChartsWidget18 = function () {
      var e:any = {
            self: null,
            rendered: !1
         },
         t = function (e:any) {
            var t = document.getElementById("kt_charts_widget_18_chart");
            if (t) {
               var a = parseInt(KTUtil.css(t, "height")),
                  l = KTUtil.getCssVariableValue("--bs-gray-900"),
                  r = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                  o = {
                     series: [{
                        name: "Spent time",
                        data: [54, 42, 75, 110, 23, 87, 50]
                     }],
                     chart: {
                        fontFamily: "inherit",
                        type: "bar",
                        height: a,
                        toolbar: {
                           show: !1
                        }
                     },
                     plotOptions: {
                        bar: {
                           horizontal: !1,
                           columnWidth: ["28%"],
                           borderRadius: 5,
                           dataLabels: {
                              position: "top"
                           },
                           startingShape: "flat"
                        }
                     },
                     legend: {
                        show: !1
                     },
                     dataLabels: {
                        enabled: !0,
                        offsetY: -28,
                        style: {
                           fontSize: "13px",
                           colors: [l]
                        },
                        formatter: function (e:any) {
                           return e
                        }
                     },
                     stroke: {
                        show: !0,
                        width: 2,
                        colors: ["transparent"]
                     },
                     xaxis: {
                        categories: ["QA Analysis", "Marketing", "Web Dev", "Maths", "Front-end Dev", "Physics", "Phylosophy"],
                        axisBorder: {
                           show: !1
                        },
                        axisTicks: {
                           show: !1
                        },
                        labels: {
                           style: {
                              colors: KTUtil.getCssVariableValue("--bs-gray-500"),
                              fontSize: "13px"
                           }
                        },
                        crosshairs: {
                           fill: {
                              gradient: {
                                 opacityFrom: 0,
                                 opacityTo: 0
                              }
                           }
                        }
                     },
                     yaxis: {
                        labels: {
                           style: {
                              colors: KTUtil.getCssVariableValue("--bs-gray-500"),
                              fontSize: "13px"
                           },
                           formatter: function (e:any) {
                              return e + "H"
                           }
                        }
                     },
                     fill: {
                        opacity: 1
                     },
                     states: {
                        normal: {
                           filter: {
                              type: "none",
                              value: 0
                           }
                        },
                        hover: {
                           filter: {
                              type: "none",
                              value: 0
                           }
                        },
                        active: {
                           allowMultipleDataPointsSelection: !1,
                           filter: {
                              type: "none",
                              value: 0
                           }
                        }
                     },
                     tooltip: {
                        style: {
                           fontSize: "12px"
                        },
                        y: {
                           formatter: function (e:any) {
                              return +e + " hours"
                           }
                        }
                     },
                     colors: [KTUtil.getCssVariableValue("--bs-primary"), KTUtil.getCssVariableValue("--bs-primary-light")],
                     grid: {
                        borderColor: r,
                        strokeDashArray: 4,
                        yaxis: {
                           lines: {
                              show: !0
                           }
                        }
                     }
                  };
               e.self = new ApexCharts(t, o), setTimeout((function () {
                  e.self.render(), e.rendered = !0
               }), 200)
            }
         };
      return {
         init: function () {
            t(e), KTThemeMode.on("kt.thememode.change", (function () {
               e.rendered && e.self.destroy(), t(e)
            }))
         }
      }
   }();

   KTUtil.onDOMContentLoaded((function () {
      KTChartsWidget18.init()
   }));

   var KTChartsWidget22 = function () {
      var e = function (e:any, t:any, a:any, l:any) {
         var r = document.querySelector(t);
         if (r) {
            parseInt(KTUtil.css(r, "height"));
            var o = {
                  series: a,
                  chart: {
                     fontFamily: "inherit",
                     type: "donut",
                     width: 250
                  },
                  plotOptions: {
                     pie: {
                        donut: {
                           size: "50%",
                           labels: {
                              value: {
                                 fontSize: "10px"
                              }
                           }
                        }
                     }
                  },
                  colors: [KTUtil.getCssVariableValue("--bs-info"), KTUtil.getCssVariableValue("--bs-success"), KTUtil.getCssVariableValue("--bs-primary"), KTUtil.getCssVariableValue("--bs-danger")],
                  stroke: {
                     width: 0
                  },
                  labels: ["Sales", "Sales", "Sales", "Sales"],
                  legend: {
                     show: !1
                  },
                  fill: {
                     type: "false"
                  }
               },
               i = new ApexCharts(r, o),
               s:any = !1,
               n = document.querySelector(e);
            !0 === l && (i.render(), s = !0), n.addEventListener("shown.bs.tab", (function (e:any) {
               0 == s && (i.render(), s = !0)
            }))
         }
      };
      return {
         init: function () {
            e("#kt_chart_widgets_22_tab_1", "#kt_chart_widgets_22_chart_1", [20, 100, 15, 25], !0)//,
            // e("#kt_chart_widgets_22_tab_2", "#kt_chart_widgets_22_chart_2", [70, 13, 11, 2], !1)
         }
      }
   }();
   KTUtil.onDOMContentLoaded((function () {
      KTChartsWidget22.init()
   }));

  }

  reportSaleForCountry(){
    let data = {
      year: this.year_1,
      month: this.month_1,
    }
    this.sales_for_year_for_country = null;
    this.salesService.reportSaleForCountry(data).subscribe((resp:any) => {
      console.log(resp)

      var categories_labels:any = [];
      var series_data:any  =[];

      this.porcentageV_sale_for_country = resp.porcentageV;
      this.sales_for_year_for_country = resp.sales_for_year

      resp.sales_for_country.forEach((element:any) => {
        categories_labels.push(element.country_region);
        series_data.push(element.total_sales);
      })

      setTimeout(() => {

        var KTChartsWidget27 = function() {
          var e:any = {
                  self: null,
                  rendered: !1
              },
              t = function(e:any) {
                  var t = document.getElementById("kt_charts_widget_27");
                  if (t) {
                      var a = KTUtil.getCssVariableValue("--bs-gray-800"),
                          l = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                          r = {
                              series: [{
                                  name: "Sessions",
                                  data: series_data
                              }],
                              chart: {
                                  fontFamily: "inherit",
                                  type: "bar",
                                  height: 350,
                                  toolbar: {
                                      show: !1
                                  }
                              },
                              plotOptions: {
                                  bar: {
                                      borderRadius: 8,
                                      horizontal: !0,
                                      distributed: !0,
                                      barHeight: 50,
                                      dataLabels: {
                                          position: "bottom"
                                      }
                                  }
                              },
                              dataLabels: {
                                  enabled: !0,
                                  textAnchor: "start",
                                  offsetX: 0,
                                  // formatter: function(e:any, t:any) {
                                  //     e *= 1e3;
                                  //     return wNumb({
                                  //         thousand: ","
                                  //     }).to(e)
                                  // },
                                  style: {
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      align: "left"
                                  }
                              },
                              legend: {
                                  show: !1
                              },
                              colors: ["#3E97FF", "#F1416C", "#50CD89", "#FFC700", "#7239EA"],
                              xaxis: {
                                  categories: categories_labels,
                                  labels: {
                                     //  formatter: function(e:any) {
                                     //      return e + "K"
                                     //  },
                                      style: {
                                          colors: a,
                                          fontSize: "14px",
                                          fontWeight: "600",
                                          align: "left"
                                      }
                                  },
                                  axisBorder: {
                                      show: !1
                                  }
                              },
                              yaxis: {
                                  labels: {
                                      formatter: function(et:any, t:any) {
                                           let result = parseInt((100 * et / 18)+"");
                                          return Number.isInteger(et) ? et + " - " + result.toString() + "%" : et
                                      },
                                      style: {
                                          colors: a,
                                          fontSize: "14px",
                                          fontWeight: "600"
                                      },
                                      offsetY: 2,
                                      align: "left"
                                  }
                              },
                              grid: {
                                  borderColor: l,
                                  xaxis: {
                                      lines: {
                                          show: !0
                                      }
                                  },
                                  yaxis: {
                                      lines: {
                                          show: !1
                                      }
                                  },
                                  strokeDashArray: 4
                              },
                              tooltip: {
                                  style: {
                                      fontSize: "12px"
                                  },
                                  y: {
                                      formatter: function(e:any) {
                                          return e
                                      }
                                  }
                              }
                          };
                      e.self = new ApexCharts(t, r), setTimeout((function() {
                          e.self.render(), e.rendered = !0
                      }), 200)
                  }
              };
          return {
              init: function() {
                  t(e), KTThemeMode.on("kt.thememode.change", (function() {
                      e.rendered && e.self.destroy(), t(e)
                  }))
              }
          }
       }();
       KTUtil.onDOMContentLoaded((function() {
          KTChartsWidget27.init()
       }));
      }, 50);
    });
  }
}
