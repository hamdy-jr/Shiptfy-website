import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';

import { VirtualService } from '../virtual.service';
import { FileParameter } from '../../../../../core/api/clients';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-photo-model',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-photo-model.component.html',
  styleUrl: './add-photo-model.component.css',
})
export class AddPhotoModelComponent implements OnDestroy {
  @Output() isUploadPhotoModalOpen = new EventEmitter<boolean>();
  @ViewChild('model') model!: ElementRef;
  imageSrc: any;
  virtualExpoPosts: any;
  subscription: Subscription | undefined;
  virtualService = inject(VirtualService);
  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target === this.model?.nativeElement) {
        this.isUploadPhotoModalOpen.emit(false);
      }
    });
  }
  file: FileParameter | undefined;

  addPhotoForm = new FormGroup({
    photo: new FormControl<string>('', Validators.required),
    title: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
    link: new FormControl('', Validators.required),
  });

  onSubmit() {
    this.subscription = this.virtualService
      .add(
        1,
        this.addPhotoForm.value.title as string,
        this.addPhotoForm.value.description as string,
        this.addPhotoForm.value.link as string,
        [
          {
            photo: this.file as FileParameter,
            order: 1,
            title: this.addPhotoForm.value.title as string,
            caption: this.addPhotoForm.value.description as string,
          },
        ],
      )
      .subscribe((res) => {
        this.isUploadPhotoModalOpen.emit(false);
      });
  }
  closeUploadPhotoModal() {
    this.isUploadPhotoModalOpen.emit(false);
  }
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.file = {
        data: file,
        fileName: file.name,
      };

      const reader = new FileReader();
      reader.onload = (e: any) => (this.imageSrc = e.target.result);

      reader.readAsDataURL(file);
    }
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
