import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CustomerService } from '../customer.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerEdit } from '../customer-edit/customer-edit';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';
import { Customer } from '../model/customer';


@Component({
  imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule
      ],
  selector: 'app-customer-list',
  styleUrl: './customer-list.scss',
  templateUrl: './customer-list.html',
  standalone: true,
})
export class CustomerList implements OnInit{
  dataSource = new MatTableDataSource<Customer>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  protected readonly ClienteService = inject(CustomerService);
  protected readonly dialog = inject(MatDialog);

    constructor(private CustomerService: CustomerService,){}
    
    loadData(): void {
      this.CustomerService.getCustomer().subscribe(
        customers => this.dataSource.data = customers
      ); 
    }

    ngOnInit(): void {
      this.loadData();
    }

    createCustomer() {    
      const dialogRef = this.dialog.open(CustomerEdit, {
        data: {}
      });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.ngOnInit();
    });    
  }

  editCustomer(customer: Customer) {
      const dialogRef = this.dialog.open(CustomerEdit, {
        data: { customer: customer }
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        this.ngOnInit();
      });
    }

  deleteCustomer(customer: Customer) {    
      const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: { 
          title: "Eliminar cliente", 
          description: "Atención si borra al cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?" 
        }
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.CustomerService.deleteCustomer(customer.id).subscribe(result=>{
            this.loadData();
          })
        }
      });
    }  



}
