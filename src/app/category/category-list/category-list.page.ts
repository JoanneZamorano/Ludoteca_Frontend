import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../model/category';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryEditComponent } from '../category-edit/category-edit';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule
    ],
    templateUrl: './category-list.page.html',
    styleUrl: './category-list.page.scss'
})
export class CategoryListComponent implements OnInit{

    dataSource = new MatTableDataSource<Category>();
    displayedColumns: string[] = ['id', 'name', 'action'];

    protected readonly CategoryService = inject(CategoryService);
    protected readonly dialog = inject(MatDialog);

    loadData(): void {
    this.CategoryService.getCategories().subscribe(
      categories => this.dataSource.data = categories
    );
  }

  ngOnInit(): void {
    this.loadData();
  }

  createCategory() {    
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadData();
    });    
  }  

  editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadData();
    });
  }

  deleteCategory(category: Category) {    
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { title: "Eliminar categoría", description: "Atención si borra la categoría se perderán sus datos.<br> ¿Desea eliminar la categoría?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CategoryService.deleteCategory(category.id).subscribe(result => {
          this.loadData();
        }); 
      }
    });
  }  
}
