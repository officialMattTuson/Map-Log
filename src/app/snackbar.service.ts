import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  private openSnackBar(message: string, type: string): void {
    let panelClass: string[] = []
    const config: MatSnackBarConfig = {
      duration: 10000,
      panelClass: [type, ...panelClass], 
      horizontalPosition: 'center',
      verticalPosition: 'top',
    };
    this.snackBar.open(message, 'close', config);
  }

  onError(message: string) {
    this.openSnackBar(message, 'error');
  }

  onSuccess(message: string) {
    this.openSnackBar(message, 'success');
  }
}
