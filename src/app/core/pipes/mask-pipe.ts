import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask',
})
export class MaskPipe implements PipeTransform {

  transform(value: string, visibleDigits:number=4): string {
    if(!value)return '';
    const maskedPart='*'.repeat(value.length-visibleDigits);
    return maskedPart+value.slice(-visibleDigits);
  }

}
