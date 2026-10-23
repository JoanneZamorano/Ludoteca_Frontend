import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Prestamo } from '../model/prestamo';
import { PrestamoService } from '../prestamo.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Pageable } from '../../core/model/page/Pageable';
import { PrestamoSearchDto } from '../model/prestamo-search.dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PrestamoEdit } from '../prestamo-edit/prestamo-edit';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';


@Component({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginator,
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

  constructor(private prestamoService: PrestamoService, public dialog: MatDialog) {}

  ngOnInit(): void {
        this.loadPage();
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

      const searchDto: PrestamoSearchDto = {
        gameId: null,
        customerId: null,
        date: null, 
        pageable: pageable,
      }

      this.prestamoService.getPrestamos(searchDto).subscribe((data) =>{
        console.log(data);
        this.dataSource.data = data.content;
        this.pageNumber = data.pageable.pageNumber;
        this.pageSize = data.pageable.pageSize;
        this.totalElements = data.totalElements;
      })

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
