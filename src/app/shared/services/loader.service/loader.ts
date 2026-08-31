import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private activeRequests = 0;
  public isLoading = signal<boolean>(false);

  show(): void {
    this.activeRequests++;
    this.isLoading.set(true);
  }

  hide(): void {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.isLoading.set(false);
    }
  }
}
