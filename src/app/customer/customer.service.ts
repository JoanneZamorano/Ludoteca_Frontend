import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Customer } from './model/customer';

@Injectable({
providedIn: 'root'
})
export class CustomerService { 

    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/customer';

    getCustomer(): Observable<Customer[]> {
        return this.http.get<Customer[]>(this.baseUrl);
    }

    saveCustomer(customer: Customer): Observable<Customer> {
      const { id } = customer;
      const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
      return this.http.put<Customer>(url, customer);
    }

    deleteCustomer(idCustomer : number): Observable<any> {
      return this.http.delete(`${this.baseUrl}/${idCustomer}`)
    }  
}
/*
this.CustomerService.getCustomer().subscribe(
        categories => this.dataSource.data = categories
      );
          */