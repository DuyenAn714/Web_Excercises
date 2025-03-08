import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FashionService } from '../../services/fashion.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-fashion-detail',
  standalone: true,
  templateUrl: './fashion-detail.component.html',
  styleUrls: ['./fashion-detail.component.css'],
  imports: [CommonModule]
})
export class FashionDetailComponent implements OnInit {
  fashion: any = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fashionService: FashionService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadFashionDetail(id);
      }
    });
  }

  loadFashionDetail(id: string): void {
    this.isLoading = true;
    this.fashionService.getFashionById(id).subscribe(
      data => {
        this.fashion = data;
        this.isLoading = false;
      },
      error => {
        console.error('Lỗi khi tải chi tiết fashion:', error);
        this.isLoading = false;
      }
    );
  }

  getImagePath(filename: string): string {
      // Nếu không có hình ảnh
      if (!filename) {
        return 'assets/images/no-image.jpg'; // Tạo một hình ảnh mặc định
      }
      
      // Nếu đường dẫn là URL đầy đủ (http hoặc https)
      if (filename.startsWith('http')) {
        return filename;
      }
      
      // Nếu đường dẫn là đường dẫn tương đối đến thư mục uploads của server
      if (filename.startsWith('uploads/')) {
        return `${environment.apiUrl}/${filename}`;
      }
      
      // Nếu chỉ là tên file, giả định ở trong thư mục assets/images
      return `assets/images/${filename}`;
    }

  goBack(): void {
    this.router.navigate(['/fashion']);
  }
}