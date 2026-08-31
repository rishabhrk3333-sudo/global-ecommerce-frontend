import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductFormValues } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  @Input() product: ProductFormValues | null = null;
  @Input() mode: 'add' | 'edit' = 'add';

  @Output() formSubmit = new EventEmitter<ProductFormValues>();
  @Output() cancel = new EventEmitter<void>();

  readonly productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required, Validators.min(1)]],
    category: ['', Validators.required],
    image: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.productForm.patchValue(this.product);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.productForm.getRawValue());
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
