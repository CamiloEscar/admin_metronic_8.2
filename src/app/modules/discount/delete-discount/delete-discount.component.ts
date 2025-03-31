import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiscountService } from '../service/discount.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-discount',
  templateUrl: './delete-discount.component.html',
  styleUrls: ['./delete-discount.component.scss']
})
export class DeleteDiscountComponent {

  @Input () discount:any;

  @Output() DiscountD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public discountService: DiscountService,
    public toastr: ToastrService,
    public modal: NgbActiveModal
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.discountService.isLoading$
  }
  delete() {
    this.discountService.deleteDiscount(this.discount.id).subscribe((resp:any) => {
      if(resp.message == 403) {
        this.toastr.error("Validacion", resp.message_text);
      } else {
        this.DiscountD.emit({message: 200});
        this.modal.close();
      }
    })
  }
}
