import { CommonModule } from '@angular/common';
import { Component, computed, input, OnInit } from '@angular/core';

export type TableHeader =
  | string // simple header uses same key as label
  | { key: string; label?: string; width?: string; align?: 'left'|'center'|'right' };

@Component({
  selector: 'app-basic-table',
  imports: [CommonModule],
  templateUrl: './basic-table.html',
  styleUrl: './basic-table.css',
})

export class BasicTable implements OnInit {
  type = input<'attendance' | 'projects' |'leave'|'holidays'>('attendance');
  headers = input.required<TableHeader[]>();
  data=input<any[]>([]);
ngOnInit(): void {
    console.log(this.type,this.headers,this.data);
}

  
  // Normalize headers to objects uniformly
  normalizedHeaders = computed(() =>
    (this.headers() ?? []).map(h =>
      typeof h === 'string' ? { key: h, label: h } : { label: h.label ?? h.key, ...h }
    )
  );

  // Optional: quick check
  readonly isEmpty = computed(() => (this.data()?.length ?? 0) === 0);

  // trackBy for performance
  trackRow = (_: number, row: any) => row?.id ?? row;

}
