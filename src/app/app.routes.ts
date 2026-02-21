// import { Routes } from '@angular/router';
// import { MainLayout } from './main-layout/main-layout';
// import { Login } from './auth/login/login';
// import { authGuard, noAuthGuard } from './auth/auth-guard';
// import { Employee } from './employee/employee';
// import { List } from './employee/list/list';

// export const routes: Routes = [
//     { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
//     { path: 'dashboard', component: MainLayout, canActivate: [authGuard] },
//     { path: 'login', component: Login, canMatch: [noAuthGuard] },
//     {path:'employee',component:Employee,children:[{path:'list',component:List}]},
//     { path: '**', redirectTo: '/login' },
// ];

import { Routes } from '@angular/router';
import { MainLayout } from './main-layout/main-layout';
import { Login } from './auth/login/login';
import { authGuard, noAuthGuard } from './auth/auth-guard';

// Feature pages

import { Employee } from './employee/employee';
import { List } from './employee/list/list';
import { Add } from './employee/add/add';
import { Profile } from './employee/profile/profile';
import { Holidays } from './holidays/holidays'
import { Apply } from './leave/apply/apply';
// add more feature components as needed...

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
                    { path: 'profile/:name', component: Profile },
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