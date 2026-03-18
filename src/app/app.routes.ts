import { Routes } from '@angular/router';
import { MainLayout } from './main-layout/main-layout';
import { Login } from './auth/login/login';
import { authGuard, noAuthGuard } from './auth/auth-guard';

// Feature pages


import { Holidays } from './ui/holidays/holidays'
import { Apply } from './ui/leave/apply/apply';
import { Employee } from './ui/employee/employee';
import { List } from './ui/employee/list/list';
import { Add } from './ui/employee/add/add';
import { Profile } from './ui/employee/profile/profile';




// add more feature components as needed...
// Directive
// custem Directive
// pipe
// intercepter global route lebel
// service
// guard


export const routes: Routes = [

    // Public routes (no layout)
    { path: 'login', component: Login, canMatch: [noAuthGuard] },

    // Private routes wrapped by MainLayout shell
    {
        path: '',
        component: MainLayout,            // <- Shell with the header/sidebar and the right-side <router-outlet>
        canActivate: [authGuard],         // <- Guard the whole shell
        children: [
            //   { path: 'dashboard', component: MainLayout },

            // Employee module routes
            {
                path: 'employee',
                children: [
                    { path: '', component: Employee },        // parent landing
                    { path: 'list', component: List },        // /employee/list
                    { path: 'add', component: Add },
                    // { path: 'documents', component: EmployeeDocumentsComponent },
                    { path: 'profile/:id', component: Profile },
                    { path: 'profile/edit/:name', component: Profile },
                ]
            },
              {
                path: 'leave',
                children: [
                    { path: '', component: Employee },        // parent landing
                    { path: 'apply', component: Apply },
                ]
            },
            { path: 'holidays', component: Holidays }
            // Add other top-level sections similarly:
            // { path: 'attendance/logs', component: AttendanceLogsComponent },
            // { path: 'attendance/summary', component: AttendanceSummaryComponent },
            // { path: 'leave/apply', component: LeaveApplyComponent },
            // { path: 'salary/list', component: SalaryListComponent },
            // ...
        ]
    },

    // Fallback
    { path: '**', redirectTo: '' }
];
``