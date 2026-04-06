import { Routes } from "@angular/router";
import { Holidays } from "./holidays";

export const holiday_routes: Routes = [
    { path: '', component: Holidays ,data:{title:'Holiday calendar'}},
   
];
