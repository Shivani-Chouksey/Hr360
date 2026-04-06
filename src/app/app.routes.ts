import { Routes } from '@angular/router';
import { MainLayout } from './main-layout/main-layout';
import { authGuard, noAuthGuard } from './auth/auth-guard';

export const routes: Routes = [
    { path: 'login', loadChildren: () => import('./auth/auth.routes').then(m => m.Auth_Routes), canMatch: [noAuthGuard] },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: 'employee', loadChildren: () => import('./ui/employee/employee.routes').then(m => m.Employee_Routes) },
            { path: 'leave', loadChildren: () => import('./ui/leave/leave.routes').then(m => m.leave_Routes) },
            { path: 'holidays', loadChildren: () => import('./ui/holidays/holiday.routes').then(m => m.holiday_routes) }
        ]
    },

    // Fallback
    { path: '**', redirectTo: '' }
];
``