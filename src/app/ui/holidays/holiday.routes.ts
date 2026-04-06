import { Routes } from "@angular/router";
import { noAuthGuard } from "../../auth/auth-guard";
import { Holidays } from "./holidays";




export const holiday_routes: Routes = [
    { path: '', component: Holidays, canMatch: [noAuthGuard] ,data:{title:'Holiday calendar'}},
   
];
