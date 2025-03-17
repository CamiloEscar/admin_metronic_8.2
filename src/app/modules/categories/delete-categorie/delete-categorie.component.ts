import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-categorie',
  templateUrl: './delete-categorie.component.html',
  styleUrls: ['./delete-categorie.component.scss']
})
export class DeleteCategorieComponent {

  @Input () categorie:any;

  @Output() CategorieD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public categoriesService: CategoriesService,
    public toastr: ToastrService,
    public modal: NgbActiveModal
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.categoriesService.isLoading$
  }
  delete() {
    this.categoriesService.deleteCategorie(this.categorie.id).subscribe((resp:any) => {
      this.CategorieD.emit({message: 200});
      this.modal.close();
    })
  }
}
