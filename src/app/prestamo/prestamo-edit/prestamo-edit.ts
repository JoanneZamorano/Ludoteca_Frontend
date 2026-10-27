import { Component, inject, OnInit, signal } from '@angular/core';
import { PrestamoService } from '../prestamo.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Prestamo } from '../model/prestamo';
import { validateFields } from '../../core/helpers/validation.helper';
import { Game } from '../../game/model/Game';
import { Customer } from '../../customer/model/customer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { GameService } from '../../game/game.service';
import { CustomerService } from '../../customer/customer.service';
import { MatSelectModule } from '@angular/material/select';


@Component({
  standalone: true,

  imports: [ 
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
],
  selector: 'app-prestamo-edit',
  styleUrl: './prestamo-edit.scss',
  templateUrl: './prestamo-edit.html',
})
export class PrestamoEdit implements OnInit{
  protected readonly prestamoService = inject(PrestamoService);
  protected readonly dialogRef = inject(MatDialogRef<PrestamoEdit>)
  protected readonly data = inject(MAT_DIALOG_DATA);

  protected readonly gameService = inject(GameService);
  protected readonly customerService = inject(CustomerService);

  protected readonly id = signal<number | null>(null);
  protected readonly game = signal<Game | null>(null);
  protected readonly customer = signal<Customer | null>(null);
  protected readonly startDate = signal<Date | null>(null);
  protected readonly endDate = signal<Date | null>(null);
  protected readonly games = signal<Game[]>([]);
  protected readonly customers = signal<Customer[]>([]);
  errorMessage = signal('');

  loadFormData(initialData: Prestamo | null){
    this.id.set(initialData?.id ?? null);
    this.game.set(initialData?.game ?? null);
    this.customer.set(initialData?.customer ?? null);
    this.startDate.set(initialData?.startDate ? new Date(initialData.startDate) : null);
    this.endDate.set(initialData?.endDate ? new Date(initialData.endDate) : null);
  }

  ngOnInit(): void {
    this.loadFormData(this.data.prestamo ?? null);

    this.gameService.getGames().subscribe(games => {
      this.games.set(games);
    });

    this.customerService.getCustomer().subscribe(customers => {
      this.customers.set(customers);
    });
  }

  onSave(){
    const id = this.id();
    const game = this.game();
    const customer = this.customer();
    const startDate = this.startDate();
    const endDate = this.endDate();

    this.errorMessage.set('');

    const requiredFields = ["game", "customer", "startDate", "endDate"] as const;
    const data = {game, customer, startDate, endDate}
       if(!validateFields(data, requiredFields)){
      return;
    }

    const prestamo = {
      id: id ?? 0,
      game,
      customer,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    } as Prestamo;

    this.prestamoService.savePrestamo(prestamo).subscribe({
      next: (response) => {
        console.log('RESPUESTA', response);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.log(err);
        console.log(err.error);
        console.log(err.error?.message);

        const message = err.error;

        if (message === 'Game not available') {
          this.errorMessage.set(
            'El juego ya está prestado en las fechas seleccionadas'
          );
        } else if (message === 'Customer has 2 loans') {
          this.errorMessage.set(
            'El cliente ya tiene 2 préstamos activos'
          );
        } else if (message === 'loans cannont exceed 14 days') {
          this.errorMessage.set(
            'El préstamo no puede superar los 14 días'
          );
        } else {
          this.errorMessage.set(
            'Se ha producido un error al guardar el préstamo'
          );
        }
      }

    });

  }
    
   onClose() {
        this.dialogRef.close(false);
    }
       
}
