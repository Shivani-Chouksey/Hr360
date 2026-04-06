import { Component, Input } from '@angular/core';
import { LeaveDialogData } from '../../../../features/leave/leave-dialog/leave-dialog';

@Component({
  selector: 'app-leave-cards',
  imports: [],
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

}
