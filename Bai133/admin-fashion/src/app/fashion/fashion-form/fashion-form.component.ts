import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FashionService, Fashion } from '../../services/fashion.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-fashion-form',
  templateUrl: './fashion-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class FashionFormComponent implements OnInit {
  fashionForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  fashionId?: string;
  imagePreview: string | null = null;
  uploadedFile: File | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private fashionService: FashionService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.fashionId = id;
        this.loadFashionData(this.fashionId);
      }
    });
  }

  initForm(): void {
    this.fashionForm = this.formBuilder.group({
      title: ['', Validators.required],
      details: ['', Validators.required],
      thumbnail: ['', Validators.required],
      style: ['', Validators.required]
    });
  }

  loadFashionData(id: string): void {
    this.fashionService.getFashionById(id).subscribe(data => {
      this.fashionForm.patchValue({
        title: data.title,
        style: data.style,
        // Xử lý nội dung details để tránh hiển thị <p></p>
        details: this.cleanHtmlTags(data.details),
        thumbnail: data.thumbnail
      });
      
      this.imagePreview = data.thumbnail;
    });
  }

  // Hàm để loại bỏ các thẻ HTML không cần thiết
  cleanHtmlTags(html: string): string {
    if (!html) return '';
    
    // Loại bỏ các thẻ p rỗng
    let cleaned = html.replace(/<p>\s*<\/p>/g, '');
    
    // Loại bỏ tất cả các thẻ HTML khác nếu cần
    cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');
    
    return cleaned;
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.uploadedFile = element.files[0];
      
      // Only process image files
      if (this.uploadedFile.type.match(/image\/*/) !== null) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(this.uploadedFile);
        
        // Upload file to server
        this.uploadImage();
      }
    }
  }

  uploadImage(): void {
    if (!this.uploadedFile) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    
    const formData = new FormData();
    formData.append('image', this.uploadedFile);
    
    this.http.post<{imageUrl: string, message: string}>('http://localhost:4000/api/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          if (event.body && event.body.imageUrl) {
            // Update form with the URL returned from server
            this.fashionForm.patchValue({
              thumbnail: `http://localhost:4000/uploads/${event.body.imageUrl}`
            });
          }
        } else if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          }
        }
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.isUploading = false;
        this.showErrorNotification('Lỗi khi tải lên ảnh: ' + error.message);
      }
    });
  }

  get f() { return this.fashionForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.fashionForm.invalid) {
      return;
    }

    const fashionData: Fashion = {
      ...this.fashionForm.value,
      _id: this.isEditMode && this.fashionId ? this.fashionId : undefined
    };
    
    if (this.isEditMode && this.fashionId) {
      this.fashionService.updateFashion(this.fashionId, fashionData).subscribe({
        next: (response) => {
          this.showSuccessNotification('Cập nhật sản phẩm thành công!');
          
          // Chờ một chút để đảm bảo dữ liệu đã được cập nhật trên server
          setTimeout(() => {
            // Chuyển đến trang chi tiết sau khi lưu
            this.router.navigate(['/fashion/detail', this.fashionId]);
          }, 500);
        },
        error: (error) => {
          this.showErrorNotification('Lỗi khi cập nhật sản phẩm: ' + error.message);
        }
      });
    } else {
      this.fashionService.addFashion(fashionData).subscribe({
        next: (response) => {
          this.showSuccessNotification('Thêm sản phẩm thành công!');
          
          // Chờ một chút để đảm bảo dữ liệu đã được lưu trên server
          setTimeout(() => {
            // Chuyển đến trang chi tiết của sản phẩm vừa tạo
            if (response && response._id) {
              this.router.navigate(['/fashion/detail', response._id]);
            } else {
              // Nếu không có ID, quay lại danh sách
              this.router.navigate(['/fashion']);
            }
          }, 500);
        },
        error: (error) => {
          this.showErrorNotification('Lỗi khi thêm sản phẩm: ' + error.message);
        }
      });
    }
  }

  resetForm(): void {
    this.submitted = false;
    if (this.isEditMode && this.fashionId) {
      this.loadFashionData(this.fashionId);
    } else {
      this.fashionForm.reset();
      this.imagePreview = null;
      this.uploadedFile = null;
    }
  }

  goBack(): void {
    this.router.navigate(['/fashion']);
  }
  
  // Simple notification methods (you can replace with your preferred notification library)
  showSuccessNotification(message: string): void {
    // Simple temporary implementation - replace with your notification system
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#28a745';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '9999';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
  
  showErrorNotification(message: string): void {
    // Simple temporary implementation - replace with your notification system
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#dc3545';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '9999';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}