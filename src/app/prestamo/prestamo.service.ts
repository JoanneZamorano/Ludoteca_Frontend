import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PrestamoSearchDto } from './model/prestamo-search.dto';
import { Observable } from 'rxjs';
import { PaginatedData } from '../core/model/page/PaginatedData';
import { Prestamo } from './model/prestamo';

@Injectable({
    providedIn: 'root'
})
export class PrestamoService {
    protected readonly http = inject(HttpClient);
    private baseUrl= 'http://localhost:8080/prestamo'

    //llamo al backend POST/prestamo
    getPrestamos(searchDto: PrestamoSearchDto): Observable<PaginatedData<Prestamo>>{
        return this.http.post<PaginatedData<Prestamo>>(this.baseUrl, searchDto);
    }

    savePrestamo(prestamo: Prestamo): Observable<Prestamo> {
        const { id } = prestamo;

        const url = id
            ? `${this.baseUrl}/${id}`
            : this.baseUrl;

        return this.http.put<Prestamo>(url, prestamo);
    }   

    deletePrestamo(idPrestamo: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${idPrestamo}`);
    }




}
