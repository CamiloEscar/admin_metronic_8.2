import { Component } from '@angular/core';
import { SlidersService } from '../services/sliders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteSlidersComponent } from '../delete-sliders/delete-sliders.component';

@Component({
  selector: 'app-lists-sliders',
  templateUrl: './lists-sliders.component.html',
  styleUrls: ['./lists-sliders.component.scss'],
})
export class ListsSlidersComponent {
  sliders: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public slidersService: SlidersService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listSliders();
    this.isLoading$ = this.slidersService.isLoading$;
  }

  listSliders(page = 1) {
    this.slidersService
      .listSliders(page, this.search)
      .subscribe((resp: any) => {
        //console.log(resp);
        this.sliders = resp.sliders;
        this.totalPages = resp.total;
        this.currentPage = page;
      });
  }

  searchTo() {
    this.listSliders();
  }

  loadPage($event: any) {
    this.listSliders($event);
  }
  deleteSlider(slider: any) {
    const modalRef = this.modalService.open(DeleteSlidersComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.slider = slider;

    modalRef.componentInstance.SliderD.subscribe((resp: any) => {
      let INDEX = this.sliders.findIndex(
        (item: any) => item.id === slider.id
      );
      if (INDEX !== -1) {
        this.sliders.splice(INDEX, 1);
      }
    });
  }
}
