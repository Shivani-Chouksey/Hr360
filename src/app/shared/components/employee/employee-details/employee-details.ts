import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-employee-details',
  imports: [NgIf, NgFor, NgClass, DatePipe],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetails{
  @Input() userDetails: any;
 

}
