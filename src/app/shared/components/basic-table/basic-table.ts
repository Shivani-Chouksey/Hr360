import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type TableHeader =
  | string
  | {
      key: string;
      label?: string;
      width?: string;
      align?: 'left' | 'center' | 'right';
    };

@Component({
  selector: 'app-basic-table',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './basic-table.html',
  styleUrl: './basic-table.css',
})
export class BasicTable {
  type = input<'attendance' | 'projects' | 'leave' | 'holidays'>('attendance');
  headers = input.required<TableHeader[]>();
  data = input<any[]>([]);

  normalizedHeaders = computed(() =>
    this.headers().map(h =>
      typeof h === 'string'
        ? { key: h, label: h }
        : { label: h.label ?? h.key, ...h }
    )
  );

  readonly isEmpty = computed(() => !this.data()?.length);

  trackRow = (_: number, row: any) => row?.id ?? row;

  /** ✅ Central formatting logic */
  formatCell(value: any, key: string) {
    if (!value) return '-';

    if (key.toLowerCase().includes('date')) {
      return new Date(value);
    }

    return value;
  }

  getStatusClass(status: string) {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }
}