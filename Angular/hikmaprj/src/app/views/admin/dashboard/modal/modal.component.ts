import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ModalComponent {
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

  // Prevent clicks inside the modal from closing it
  preventClose(event: Event): void {
    event.stopPropagation();
  }
}