import { Component, inject } from '@angular/core';
import { LoaderService } from '../../services/loader.service/loader';

@Component({
  selector: 'app-loader',
  imports: [],
  template: ` @if (loaderService.isLoading()) {
    <div class="loader-overlay">
      <div class="loader"></div>
    </div>
  }`,
  styleUrl: './loader.css',
})
export class Loader {
  public loaderService = inject(LoaderService);
}
