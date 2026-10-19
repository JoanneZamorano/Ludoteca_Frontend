import { Component, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../customer.service';
import { Customer } from '../model/customer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
  selector: 'app-customer-edit',
  styleUrl: './customer-edit.scss',
  templateUrl: './customer-edit.html',
  standalone: true,
})
export class CustomerEdit implements OnInit{

  protected readonly dialogRef = inject(MatDialogRef<CustomerEdit>);
  protected readonly data = inject(MAT_DIALOG_DATA) as { customer: Customer };
  protected readonly categoryService = inject(CustomerService);

  protected readonly id = signal<number | null>(null);
  protected readonly name = signal<string | null>(null);
  errorMessage = signal<string>('');
  
  constructor(private CustomerService: CustomerService,){}

  ngOnInit(): void {
    this.loadFormData(this.data.customer ?? null);
  }

  loadFormData(initialData: Customer | null): void {
    this.id.set(initialData?.id ?? null);
    this.name.set(initialData?.name ?? null);
  }


  onSave() {
    const id = this.id();
    const name = this.name();
  
    if(!name) {
      return;
    }
    this.errorMessage.set('');
  
    const customer = { id, name } as Customer;
      this.CustomerService.saveCustomer(customer).subscribe({
        next: ()=>{
          this.dialogRef.close(true);
        },
        error: ()=>{
          this.errorMessage.set('Ya hay un cliente con ese nombre')
        }
      })
    
  }

  onClose() {
    this.dialogRef.close();
  }


}