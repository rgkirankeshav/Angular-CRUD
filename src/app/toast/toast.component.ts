import { Component, Input } from '@angular/core';
import { TableService } from '../table.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent {
  notificationMessage = '';
  showToast:boolean = false;
  toast!: bootstrap.Toast;

  constructor(private tableService:TableService){
    
  }

  ngOnInit() {
    this.tableService.actionSuccess.subscribe((message:string) => {
      this.notificationMessage = message;
      this.initializeToast();
      this.showToast = true;
      this.toast.show();
      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    })
   }

  private initializeToast() {
    const toastElement = document.getElementById('notificationToast');
    if (toastElement) {
      this.toast = new bootstrap.Toast(toastElement);
    }
  }



}
