import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { signal, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';


import { Prestamo } from '../model/prestamo';
import { PrestamoService } from '../prestamo.service';
import { PrestamoEdit } from '../prestamo-edit/prestamo-edit';
import { PrestamoSearchDto } from '../model/prestamo-search.dto';

import { Customer } from '../../customer/model/customer';
import { CustomerService } from '../../customer/customer.service';

import { Game } from '../../game/model/Game';
import { GameService } from '../../game/game.service';

import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';
import { Pageable } from '../../core/model/page/Pageable';



@Component({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginator,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  selector: 'app-prestamo-list',
  styleUrl: './prestamo-list.scss',
  templateUrl: './prestamo-list.html',
})
export class PrestamoList implements OnInit{
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Prestamo>();
  displayedColumns: string[] = ['id', 'game', 'customer', 'startDate', 'endDate', 'action']

  protected readonly games = signal<Game[]>([]);
  protected readonly customers = signal<Customer[]>([]);
  protected readonly filterDate = signal<Date | null>(null);

  protected readonly filterGame = signal<Game | null>(null);
  protected readonly filterCustomer = signal<Customer | null>(null);

  constructor(private prestamoService: PrestamoService, public dialog: MatDialog) {}

  protected readonly gameService = inject(GameService);
  protected readonly customerService = inject(CustomerService);

  

  ngOnInit(): void {
    this.loadPage();

    this.gameService.getGames().subscribe(games => {
      this.games.set(games);
    });

    this.customerService.getCustomer().subscribe(customers => {
      this.customers.set(customers);
    });

  }

  loadPage(event?: PageEvent) {
 
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };

  if (event != null) {
    pageable.pageSize = event.pageSize;
    pageable.pageNumber = event.pageIndex;
    }


  //para filtrar bien las fechas 
  let dateFilter = null;
  if (this.filterDate()) {
    const selectedDate = this.filterDate()!;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');

    dateFilter = `${year}-${month}-${day}`;
  }

  const searchDto: PrestamoSearchDto = {
    gameId: this.filterGame()?.id ?? null,
    customerId: this.filterCustomer()?.id ?? null,
    date: dateFilter,
    pageable: pageable
  }

  this.prestamoService.getPrestamos(searchDto).subscribe((data) =>{
    console.log(data);

    this.dataSource.data = data.content;
    this.pageNumber = data.pageable.pageNumber;
    this.pageSize = data.pageable.pageSize;
    this.totalElements = data.totalElements;
    })

  }

  cleanFilters() {
    this.filterGame.set(null);
    this.filterCustomer.set(null);
    this.filterDate.set(null);

    this.loadPage();
  }

    createPrestamo() {

      const dialogRef = this.dialog.open(PrestamoEdit, {
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) return;

        this.ngOnInit();
      });
    }


    editPrestamo(prestamo:Prestamo){
      const dialogRef = this.dialog.open(PrestamoEdit, {
                  data: { prestamo: prestamo },
              });
      
              dialogRef.afterClosed().subscribe((result) => {
                  if(!result) return;
                  this.ngOnInit();
              });
    }


    deletePrestamo(prestamo : Prestamo){
      const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: {
          title: 'Eliminar préstamo',
          description: 'Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo?'
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.prestamoService.deletePrestamo(prestamo.id).subscribe((result) => {
                    this.ngOnInit();
                });
            }
        });

    }


}
