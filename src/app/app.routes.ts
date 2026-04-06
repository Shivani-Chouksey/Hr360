import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard, noAuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: 'login', loadChildren: () => import('./features/auth/auth.routes').then(m => m.Auth_Routes), canMatch: [noAuthGuard] },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: 'employee', loadChildren: () => import('.//features/employee/employee.routes').then(m => m.Employee_Routes) },
            { path: 'leave', loadChildren: () => import('.//features/leave/leave.routes').then(m => m.leave_Routes) },
            { path: 'holidays', loadChildren: () => import('./features/holidays/holiday.routes').then(m => m.holiday_routes) }
        ]
    },

    // Fallback
    { path: '**', redirectTo: '' }
];
``