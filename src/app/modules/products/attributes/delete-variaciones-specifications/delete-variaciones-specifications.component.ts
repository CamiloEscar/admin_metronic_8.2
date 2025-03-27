import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-variaciones-specifications',
  templateUrl: './delete-variaciones-specifications.component.html',
  styleUrls: ['./delete-variaciones-specifications.component.scss'],
})
export class DeleteVariacionesSpecificationsComponent {
  @Input() specification: any;
  @Input() is_variation: any;

  @Output() SpecificationD: EventEmitter<any> = new EventEmitter();
  isLoading: any;
  constructor(
    public attributeService: AttributesService,
    public toastr: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.attributeService.isLoading$;
  }

  delete() {
    if (!this.is_variation) {
      this.deleteSpecificacion();
    } else {
      this.deleteVariation();
    }
  }
  deleteSpecificacion() {
    this.attributeService
      .deleteSpecification(this.specification.id)
      .subscribe((resp: any) => {
        this.SpecificationD.emit({ message: 200 });
        this.modal.close();
      });
  }
  deleteVariation() {
    this.attributeService
      .deleteVariation(this.specification.id)
      .subscribe((resp: any) => {
        this.SpecificationD.emit({ message: 200 });
        this.modal.close();
      });
  }
}
