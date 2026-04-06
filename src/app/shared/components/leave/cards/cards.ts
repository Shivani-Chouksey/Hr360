import { Component, Input } from '@angular/core';
import { LeaveDialogData } from '../../../../features/leave/leave-dialog/leave-dialog';
import { MatCalendarHeader } from "@angular/material/datepicker";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-leave-cards',
  imports: [MatCardModule, MatButtonModule,MatProgressBarModule],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {
@Input() item!:{
      total:number;
      used:number;
      remaining:number;
      usageRatio:number;
    }
@Input() title:string=''
progress="item?.usageRatio * 100"

}
