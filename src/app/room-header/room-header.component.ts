import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'room-header',
  templateUrl: './room-header.component.html',
  styleUrls: ['./room-header.component.css']
})
export class RoomHeaderComponent {
  showPassword = false;

  constructor(private sharedService: SharedService,
    private snackBar: MatSnackBar) { }

  copyToClipboard(text: string, snackBarMessage: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.display = 'hidden';

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    document.execCommand('copy');
    document.body.removeChild(textarea);

    this.snackBar.open(snackBarMessage, 'Dismiss', {
      duration: 3000
    });
  }
}
