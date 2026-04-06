import { CommonModule } from '@angular/common';
import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy,
  OnInit, Output, ViewChild, AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() open = false;                   // control visibility
  @Input() title = '';                     // accessible title
  @Input() closeOnBackdrop = true;         // click outside to close
  @Input() ariaDescribedBy?: string;       // optional description id
  @Output() closed = new EventEmitter<void>();

  @ViewChild('panel') panelRef!: ElementRef<HTMLDivElement>;

  private lastFocused?: Element;
  private previouslyOverflow?: string | null;

  ngOnInit() {
    if (this.open) this.onOpenSideEffects();
  }

  ngAfterViewInit() {
    if (this.open) this.focusFirstFocusable();
  }

  ngOnDestroy() {
    // ensure clean up if destroyed while open
    if (this.open) this.onCloseSideEffects();
  }

  ngOnChanges() {
    if (this.open) {
      this.onOpenSideEffects();
      // delay to ensure content is in DOM
      setTimeout(() => this.focusFirstFocusable());
    } else {
      this.onCloseSideEffects();
    }
  }

  /** Close API for parent */
  close() {
    if (!this.open) return;
    this.open = false;
    this.closed.emit();
  }

  /** Close on ESC */
  // @HostListener('document:keydown.escape', ['$event'])
  // onEsc(ev: KeyboardEvent) {
  //   if (this.open) {
  //     ev.preventDefault();
  //     this.close();
  //   }
  // }

  /** Backdrop clicks */
  onBackdropClick(ev: MouseEvent) {
    if (!this.closeOnBackdrop) return;
    // only when clicking on backdrop, not inner panel
    if ((ev.target as HTMLElement)?.classList.contains('app-modal__backdrop')) {
      this.close();
    }
  }

  /** Trap focus inside dialog */
  @HostListener('document:focusin', ['$event'])
  onFocusIn(ev: FocusEvent) {
    if (!this.open || !this.panelRef) return;
    const panel = this.panelRef.nativeElement;
    if (!panel.contains(ev.target as Node)) {
      this.focusFirstFocusable();
    }
  }

  private onOpenSideEffects() {
    // save focus, prevent background scroll
    this.lastFocused = document.activeElement || undefined;
    this.previouslyOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
  }

  private onCloseSideEffects() {
    // restore scroll and focus
    document.body.style.overflow = this.previouslyOverflow ?? '';
    if (this.lastFocused instanceof HTMLElement) {
      this.lastFocused.focus();
    }
  }

  private focusFirstFocusable() {
    const panel = this.panelRef?.nativeElement;
    if (!panel) return;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (focusables[0] || panel).focus();
  }
}