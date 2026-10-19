import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/games', pathMatch: 'full'},
    { path: 'categories', loadComponent: () => import('../app/category/category-list/category-list.page').then(m => m.CategoryListComponent)},
    { path: 'authors', loadComponent: () => import('../app/author/author-list/author-list.page').then(m => m.AuthorListComponent)},
    { path: 'games', loadComponent: () => import('../app/game/game-list/game-list.page').then(m => m.GameListComponent)},
    { path: 'customer', loadComponent: () => import('../app/customer/customer-list/customer-list').then(m => m.CustomerList)},
];
