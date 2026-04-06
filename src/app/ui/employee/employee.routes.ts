import { Routes } from "@angular/router";
import { Employee } from "./employee";
import { List } from "./list/list";
import { Add } from "./add/add";
import { Profile } from "./profile/profile";
import { TeamMember } from "./team-member/team-member";

export const Employee_Routes: Routes = [
    { path: '', component: Employee, data: { title: 'Employee Dashboard' } },      
    { path: 'list', component: List, data: { title: 'Employee List' } },        
    { path: 'add', component: Add, data: { title: 'Add Employee' } },
    { path: 'profile/:id', component: Profile, data: { title: 'Profile' } },
    { path: 'profile/edit/:id', component: Profile, data: { title: 'Profile Edit' } },
    { path: 'team-member/:id', component: TeamMember, data: { title: 'Team Members' } },
];
