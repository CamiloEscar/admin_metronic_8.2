import { Component } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-categorie',
  templateUrl: './list-categorie.component.html',
  styleUrls: ['./list-categorie.component.scss']
})
export class ListCategorieComponent {

  categories:any = [];
  search:string = '';
  totalPages:number = 0;
  currentPage:number = 1;

  isLoading$:any;


  constructor(
    public categoriesService: CategoriesService,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listCategories();
    this.isLoading$ = this.categoriesService.isLoading$;
  }

  listCategories( page = 1){
    this.categoriesService.listCategories(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.categories = resp.categories.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  getDomParser(categorie:any) {
    var miDiv:any = document.getElementById('svg-categorie-'+categorie.id);
    miDiv.innerHTML = categorie.icon;
    return '';
  }
}
