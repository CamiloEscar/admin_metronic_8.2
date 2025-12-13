import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CostosenvioService } from '../service/costoenvio.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-costo',
  templateUrl: './delete-costo.component.html',
  styleUrls: ['./delete-costo.component.scss']
})
export class DeleteCostoComponent {

  @Input () costo:any;

    @Output() CostoD: EventEmitter<any> = new EventEmitter();
    isLoading:any;
    constructor(
      public costoService: CostosenvioService,
      public toastr: ToastrService,
      public modal: NgbActiveModal
    ){

    }

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.isLoading = this.costoService.isLoading$
    }
    delete() {
      this.costoService.deleteCosto(this.costo.id).subscribe((resp:any) => {
        if(resp.message == 403) {
          this.toastr.error("Validacion", resp.message_text);
        } else {
          this.CostoD.emit({message: 200});
          this.modal.close();
        }
      })
    }
}
