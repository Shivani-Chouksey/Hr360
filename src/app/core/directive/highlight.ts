import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlightCustomDirective]',
})
export class HighlightDirective {

  constructor(private el: ElementRef) { }
  @HostListener('mouseenter')
  onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = '#4285E0'
    this.el.nativeElement.style.padding = '10px'
    this.el.nativeElement.style.color = 'white'
  }

  @HostListener('mouseleave')
  onMounseLeave() {
    this.el.nativeElement.style.padding = ''
    this.el.nativeElement.style.backgroundColor = ''
    this.el.nativeElement.style.color = ''
  }

}
